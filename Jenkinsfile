// Jenkins 서버에 Docker / Docker Compose가 설치되어 있어야 합니다.
// JDK·Node는 Docker 이미지 안에서 사용하므로 Jenkins에 직접 설치하지 않아도 됩니다.
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh '''
                        docker run --rm -v "$PWD":/workspace -w /workspace \
                          gradle:8.14-jdk17 gradle test --no-daemon
                    '''
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/build/test-results/test/*.xml'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm -v "$PWD":/app -w /app \
                          node:22-alpine sh -c "npm ci && npm run build"
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success { echo '빌드 성공' }
        failure { echo '빌드 실패' }
    }
}
