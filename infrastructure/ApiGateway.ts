import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class ApiGateway extends RestApi {
    constructor(scope: Construct) {
        super(scope, "ApiGateway", {
            restApiName: 'clickdealer-demo-app-gateway',
        });
    }

    addIntegration(method: string, path: string, lambda: IFunction) {
        const resource = this.root.resourceForPath(path);
        resource.addMethod(method, new LambdaIntegration(lambda))
    }
}