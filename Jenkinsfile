
pipeline {
    agent any

    environment {
        IMAGE = "rahuljha0007/staynest:v3"
        AWS_REGION = "us-east-1"
        AWS_DEFAULT_REGION = "us-east-1"
        CLUSTER_NAME = "staynest-cluster"
        PATH = "/usr/bin:/usr/local/bin:${env.PATH}"
    }

    stages {

        stage('Docker Build & Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set -e
                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" --password-stdin

                        docker build -t "$IMAGE" .
                        docker push "$IMAGE"

                        docker logout
                    '''
                }
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('terraform') {
                        sh '''
                            set -e
                            terraform init
                        '''
                    }
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    sh 'terraform validate'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('terraform') {
                        sh '''
                            set -e
                            terraform plan -out=tfplan
                        '''
                    }
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('terraform') {
                        sh '''
                            set -e
                            terraform apply -auto-approve tfplan
                        '''
                    }
                }
            }
        }

        stage('Update kubeconfig') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        set -e

                        aws sts get-caller-identity

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl get nodes
                    '''
                }
            }
        }

        stage('Install Ingress Controller') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        set -e

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl apply -f \
                          https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

                        kubectl wait \
                            --namespace ingress-nginx \
                            --for=condition=ready pod \
                            --selector=app.kubernetes.io/component=controller \
                            --timeout=300s
                    '''
                }
            }
        }

        stage('Create Kubernetes Secret') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY'),
                    string(credentialsId: 'mongo-url',
                           variable: 'MONGO_URL'),
                    string(credentialsId: 'mapbox-token',
                           variable: 'MAPBOX_TOKEN'),
                    string(credentialsId: 'cloudinary-name',
                           variable: 'CLOUD_NAME'),
                    string(credentialsId: 'cloudinary-key',
                           variable: 'API_KEY'),
                    string(credentialsId: 'cloudinary-secret',
                           variable: 'API_SECRET'),
                    string(credentialsId: 'session-secret',
                           variable: 'SECRET')
                ]) {
                    sh '''
                        set -e

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl create secret generic staynest-secret \
                            --dry-run=client -o yaml \
                            --from-literal=MONGO_URL="$MONGO_URL" \
                            --from-literal=MAPBOX_TOKEN="$MAPBOX_TOKEN" \
                            --from-literal=CLOUD_NAME="$CLOUD_NAME" \
                            --from-literal=API_KEY="$API_KEY" \
                            --from-literal=API_SECRET="$API_SECRET" \
                            --from-literal=SECRET="$SECRET" \
                            | kubectl apply -f -
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        set -e

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl apply -f kubernetes/

                        kubectl rollout restart deployment/staynest

                        kubectl rollout status deployment/staynest \
                            --timeout=300s
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        set -e

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl get nodes
                        kubectl get pods -A
                        kubectl get svc -A
                        kubectl get ingress -A
                        kubectl get deployment staynest
                    '''
                }
            }
        }

        stage('Destroy Infrastructure') {
            steps {
                input message: 'Do you want to destroy StayNest infrastructure?'

                withCredentials([
                    string(credentialsId: 'aws-access-key',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        set -e

                        aws sts get-caller-identity

                        aws eks update-kubeconfig \
                            --region "$AWS_REGION" \
                            --name "$CLUSTER_NAME"

                        kubectl delete -f kubernetes/ \
                            --ignore-not-found=true

                        kubectl delete -f \
                          https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml \
                          --ignore-not-found=true

                        cd terraform
                        terraform destroy -auto-approve
                    '''
                }
            }
        }
    }
}
