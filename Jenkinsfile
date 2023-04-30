def buildWebPackage() {
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
        sh 'tar -czvf dist.tar.gz dist/'
        // 获取凭据
        withCredentials([usernamePassword(
            credentialsId: '306954f3-2646-4a2e-bfc5-bfde07403643',
            passwordVariable: 'password',
            usernameVariable: 'username'
        )]) {
            def remote = [:]
            remote.name = 'arm'
            remote.host = '172.17.0.1'
            remote.port = 10011
            remote.user = username
            remote.password = password
            remote.allowAnyHosts = true
            // 上传服务器，arm
            // sh 'scp dist.tar.gz root@172.17.0.1:/opt/docker/dev-itravel-web/tmp'
            sshPut remote: remote, from: 'dist.tar.gz', into: '/opt/docker/dev-itravel-web/tmp'
            // 执行其他任务
            sshScript remote: remote, script: '''
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

pipeline {
    agent any
    tools {
        nodejs "Node18.14.0"
    }
    stages {
        stage('Build_All_Package') {
            // 根目录文件发生了变化，所有项目重新打包
            when {
                changeset '**/*'
                not {
                    changeset 'packages/**'
                }
            }
            steps {
                // 自动执行
                buildWebPackage()
            }
        }
        stage('Build_Web_Package') {
            when {
                changeset 'packages/web/**'
                not {
                    changeset '**/packages/web'
                }
            }
            steps {
                buildWebPackage()
            }
        }
    }
}
