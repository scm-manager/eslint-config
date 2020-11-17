#!groovy
pipeline {

  agent {
    docker {
      image 'node:14.15.1'
      label 'docker'
    }
  }

  environment {
    HOME = "${env.WORKSPACE}"
  }

  stages {

    stage('Install') {
      steps {
        sh 'yarn install'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn run test-ci'
        junit 'junit.xml'
      }
    }

  }

}
