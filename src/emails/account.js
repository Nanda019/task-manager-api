const sgMail=require('@sendgrid/mail')

const sendgridAPIkey="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"

sgMail.setApiKey(sendgridAPIkey)

const msg={
    to:'2018aut0222@svce.ac.in',
    from:'2018aut0222@svce.ac.in',
    subject:"This is from sendgrid for trail purposes",
    text:"I hope this one actually get to yo. This is a trail message."
}

sgMail.send(msg).then(() => {
    console.log('Email sent')
  }).catch((error) => {
    console.error(error)
  })