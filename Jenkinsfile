

pipeline {
    agent any
    plugins {
        id 'ssh-pipeline'
    }
    tools {
        nodejs "Node18.14.0"
    }
    stages {
        stage('Prune Branch') {
            when {
                changeset '/**'
            }
            steps {
                // 避免分支错误如 bugfix/list 和 bugfix/list/header 形式，需要Jenkins本地分支与远程保持一致
                sh 'git remote update origin --prune'
            }
        }
        stage('Build Web Package') {
            when {
                changeset 'packages/web/**'
            }
            steps {
                dir('packages/web') {
                    // 清除dist
                    sh 'rm -rf ./dist'
                    // echo
                    sh 'npm -v && npm i -g pnpm && pnpm -v'
                    // 安装依赖
                    sh 'pnpm install --no-frozen-lockfile --ignore-scripts'
                    // 构建
                    sh 'pnpm run build'
                    // 打包，打包文件名，打包文件路径
                    withArchive('dist.tar.gz') {
                        sh 'tar -czvf dist.tar.gz dist/'
                    }
                    // 上传服务器，arm
                    // sh 'scp dist.tar.gz root@172.17.0.1:/opt/docker/dev-itravel-web/tmp'
                    sshPut remote: [host: '172.17.0.1', user: 'root'], from: 'dist.tar.gz', into: '/opt/docker/dev-itravel-web/tmp'
                    // 执行其他任务
                    sshagent(credentials: ['306954f3-2646-4a2e-bfc5-bfde07403643']) {
                        sshScript remote: [host: 'your_host', user: 'your_user'], script: '''
                            cd /opt/docker/dev-itravel-web/tmp

                            # 清除
                            sudo rm -rf  ./html/*

                            echo "info: 远程解压"

                            # 解压，跳过头层
                            sudo tar -zxvf ./tmp/dist.tar.gz -C ./html --strip-components=1

                            # 无需重启
                            # docker restart dev-itravel-web
                        '''
                    }
                }
            }
        }
    }
}
