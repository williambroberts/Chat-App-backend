"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordTemplate = void 0;
const ResetPasswordTemplate = (props) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            
            body {
                color:royalblue;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
        </style>
    </head>
    <body>
        <h4 class="reset__">Reset Email ${props.toEmail}</h4>
        <span>Here is your reset token ${props.resetToken}</span>
    </body>
    </html>
    `;
};
exports.ResetPasswordTemplate = ResetPasswordTemplate;
