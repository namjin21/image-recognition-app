import { ResourcesConfig } from "aws-amplify";

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-2_li5TExt60',
      userPoolClientId: '61l4oah2lb8gpe4diajavo7rr3',
      loginWith: {
        username: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
    },
  },
};
export default amplifyConfig;
