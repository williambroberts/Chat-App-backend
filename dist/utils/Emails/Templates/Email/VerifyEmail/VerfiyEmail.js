"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailTemplate = void 0;
const VerifyEmailTemplate = (props) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h4>Verify your email  ${props.toEmail}</h4>
    <h6>Please click the link below to verify your email</h6>
    <span>${props.verifcationToken}</span>
</body>
</html>
    `;
};
exports.VerifyEmailTemplate = VerifyEmailTemplate;
