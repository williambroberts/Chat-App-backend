import { createTransport } from "nodemailer";

import { ResetPasswordTemplate } from "./Templates/Email/ResetPassword/ResetPassword";
import { VerifyEmailTemplate } from "./Templates/Email/VerifyEmail/VerfiyEmail";

const transporter  =createTransport({
    host:"smtp-relay.brevo.com",
    port:587,
    auth:{
        user:"williambrobertsemail@gmail.com",
        pass:"XfFHsYyICBURAhzN"
    }
})
 //makes your email nice and full of css


export async function sendPasswordResetEmail(toEmail:string,resetToken:string){
    await transporter.sendMail({
        from:"williambrobertsemail@gmail.com",
        to:toEmail,
        subject:"Reset your password",
        html:ResetPasswordTemplate({toEmail,resetToken})
        
    })
}

export async function sendVerificationEmail({toEmail,verifcationToken}:{toEmail:string,verifcationToken:string}){
    await transporter.sendMail({
        from:"williambrobertsemail@gmail.com",
        to:toEmail,
        subject:"Verify your email",
        html:VerifyEmailTemplate({toEmail,verifcationToken})
    })
}