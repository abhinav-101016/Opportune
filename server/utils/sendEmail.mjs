import nodemailer from "nodemailer"

export const sendEmail=async(to , subject,text)=>{
    const transporter=nodemailer.createTransport(
        {
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            secure:false,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
        }
    );

   try{ await transporter.sendMail({
        from:`"Opportune" <${process.env.EMAIL_SENDER}>`,
        to,
        subject,
        text,
    });
    }
    catch(error){
        console.error("Email send failed:",error);
    }
};