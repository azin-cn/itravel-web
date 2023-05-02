def buildPackage(dirPath, serverPath, dockerName, params) {
    dir(dirPath) {
        // 清除dist
        sh 'rm -rf ./dist'
        // echo
        sh 'npm -v && npm i -g pnpm && pnpm -v'
        // 安装依赖
        sh 'pnpm install --no-frozen-lockfile --ignore-scripts'
        // 构建
        script {
            if (params.CUSTOMER_NODE_ENV == 'production') {
                sh "pnpm run build"
            } else {
                sh "pnpm run build:dev"
            }
        }
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
            // 判断目录是否存在
            sshCommand remote: remote, command: """
                if [[ -d "${serverPath}/tmp" ]]; then 
                    echo "info: ${serverPath}/tmp folder already exist, skip"
                else
                    echo "info: ${serverPath}/tmp folder not exist, create"
                    mkdir -p ${serverPath}/tmp
                fi
            """
            // 上传服务器，arm sh 'scp dist.tar.gz root@172.17.0.1:/opt/docker/dev-itravel-web/tmp'
            sshPut remote: remote, from: 'dist.tar.gz', into: "${serverPath}/tmp"
            // 执行其他任务
            sshCommand  remote: remote, command: """
                cd ${serverPath}

                echo "info: cd into \$(pwd)"

                if [[ -e './html' ]]; then
                    echo "info: html folder already exist, delete html folder"
                    rm -rf './html/*'
                else
                    echo "info: html folder not exist, create html folder"
                    mkdir -p './html'
                fi

                echo "info: 远程解压";

                sudo tar -zxvf ./tmp/dist.tar.gz -C ./html --strip-components=1; # 解压，跳过头层

                docker restart ${dockerName} # 重启docker
            """
        }
    }
}

pipeline {
    agent any
    tools {
        nodejs "Node18.14.0"
    }
    environment {
        PACKAGE_DIR_WEB = 'packages/web'
        PACKAGE_DIR_ADMIN = 'packages/admin'
        PACKAGE_DIR_MOBILE = 'packages/mobile'
        SERVER_PATH_WEB = '/opt/docker/dev-itravel-web/web'
        SERVER_PATH_ADMIN = '/opt/docker/dev-itravel-web/admin'
        SERVER_PATH_MOBILE = '/opt/docker/dev-itravel-web/mobile'
        DOCKER_NAME_WEB = 'dev-itravel-web-web'
        DOCKER_NAME_ADMIN = 'dev-itravel-web-admin'
        DOCKER_NAME_MOBILE = 'dev-itravel-web-mobile'
    }
    parameters {
        choice(
            name: 'PACKAGE',
            choices: ['all', 'packages/web', 'packages/admin', 'packages/mobile'],
            description: '指定项目打包'
        )
        choice(
            name: 'CUSTOMER_NODE_ENV',
            choices: ['production', 'development'],
            description: '指定环境打包'
        )
        choice(
            name: 'CLEAN_WORKSPACE',
            choices: [false, true],
            description: '是否删除工作空间'
        )
    }
    // 处于workspace中
    stages {
        stage('Clean_Workspace') {
            steps {
                script {
                    if (params.CLEAN_WORKSPACE == true) {
                        cleanWs(
                            cleanWhenAborted: true,
                            cleanWhenFailure: true,
                            cleanWhenNotBuilt: true,
                            cleanWhenSuccess: true,
                            cleanWhenUnstable: true,
                            cleanupMatrixParent: true,
                            disableDeferredWipeout: true,
                            deleteDirs: true
                        )
                    }
                }
            }
        }
        stage('Empty_Commit') {
            // 针对于非git触发的操作，commit无任何变化
            when {
                not {
                    changeset '**/*'
                }
            }
            steps {
                script {
                    if (params.PACKAGE == 'all') {
                        buildPackage(env.PACKAGE_DIR_WEB, env.SERVER_PATH_WEB, env.DOCKER_NAME_WEB, params)
                        buildPackage(env.PACKAGE_DIR_ADMIN, env.SERVER_PATH_ADMIN, env.DOCKER_NAME_ADMIN, params)
                        buildPackage(env.PACKAGE_DIR_MOBILE, env.SERVER_PATH_MOBILE, env.DOCKER_NAME_MOBILE, params)
                    } else if (params.PACKAGE == env.PACKAGE_DIR_WEB) {
                        buildPackage(env.PACKAGE_DIR_WEB, env.SERVER_PATH_WEB, env.DOCKER_ADMIN_WEB, params)
                    } else if (params.PACKAGE == env.PACKAGE_DIR_ADMIN) {
                        buildPackage(env.PACKAGE_DIR_ADMIN, env.SERVER_PATH_ADMIN, env.DOCKER_NAME_ADMIN, params)
                    } else if (params.PACKAGE == env.PACKAGE_DIR_MOBILE) {
                        buildPackage(env.PACKAGE_DIR_MOBILE, env.SERVER_PATH_MOBILE, env.DOCKER_NAME_MOBILE, params)
                    }
                }
            }
        }
        stage('Build_All_Package') {
            // 当packages外的目录有发生变化时（配置文件），重新打包所有项目
            // TODO 目前还是有一个逻辑bug，当提交的内容包含非packages内的内容和packages/admin的内容，只触发了admin的打包，正确的做法是打包所有
            // TODO 只要包含非packages的内容就打包所有，只有web发生了变化才打包web（排除了其他的变化），admin同理，语法难以表达，not表达不包含
            // TODO 目前如果涉及到根目录手动打包一次
            when {
                changeset '**/*'
                not {
                    changeset 'packages/**'
                }
            }
            steps {
                buildPackage(env.PACKAGE_DIR_WEB, env.SERVER_PATH_WEB, env.DOCKER_NAME_WEB, params)
                buildPackage(env.PACKAGE_DIR_ADMIN, env.SERVER_PATH_ADMIN, env.DOCKER_NAME_ADMIN, params)
                buildPackage(env.PACKAGE_DIR_MOBILE, env.SERVER_PATH_MOBILE, env.DOCKER_NAME_MOBILE, params)
            }
        }
        stage('Build_Web_Package') {
            // 当packages/web发生变化，只打包web项目，避免二次打包需要设置根目录不发生变化
            when {
                changeset 'packages/web/**'
            }
            steps {
                buildPackage(env.PACKAGE_DIR_WEB, env.SERVER_PATH_WEB, env.DOCKER_NAME_WEB, params)
            }
        }
        stage('Build_Admin_Package') {
            // 当packages/admin发生了变化，只打包admin，避免二次打包需要设置根目录不发生变化
            when {
                changeset 'packages/admin/**'
            }
            steps {
                buildPackage(env.PACKAGE_DIR_ADMIN, env.SERVER_PATH_ADMIN, env.DOCKER_NAME_ADMIN, params)
            }
        }
        stage('Build_Mobile_Package') {
            // 当packages/admin发生了变化，只打包admin，避免二次打包需要设置根目录不发生变化
            when {
                changeset 'packages/mobile/**'
            }
            steps {
                buildPackage(env.PACKAGE_DIR_MOBILE, env.SERVER_PATH_MOBILE, env.DOCKER_NAME_MOBILE, params)
            }
        }
    }
}
