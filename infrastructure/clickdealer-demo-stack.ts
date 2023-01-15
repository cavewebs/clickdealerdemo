import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGateway } from './ApiGateway';
import { Dynamo } from './Dynamo';
import { Lambda } from './Lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ClickdealerDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Api Gateway setup
    const api = new ApiGateway(this);

    //Lambdas setup
    const vehicleLambda = new Lambda(this, "vehicle-api");
    //Database
    const ddb = new Dynamo(this);
    ddb.grantReadWriteData(vehicleLambda);

    api.addIntegration("POST", "/vehicles", vehicleLambda);
    api.addIntegration("GET", "/vehicles", vehicleLambda);
    api.addIntegration("GET", "/vehicles/{id}", vehicleLambda);
    api.addIntegration("PATCH", "/vehicles/{id}", vehicleLambda);
    api.addIntegration("DELETE", "/vehicles/{id}", vehicleLambda);



    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ClickdealerDemoQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
