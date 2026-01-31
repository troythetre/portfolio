import React, { useRef } from 'react';
import emailjs from '@emailjs-com';

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('gmail', 'My Default Template', form.current, 'D6cE8aLybtnADce20')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };
  return (
    <div>
        <div className="container">
            <form onSubmit={sendEmail}>
            <div className='row pt-5 mx-auto'>

            <div className='col-8 form-group mx-auto'>
                <input type="text" className='form-control' placeholder='Name' value='name'/>
            </div>
            <div className='col-8 form-group mx-auto'>
                <input type="email" className='form-control' placeholder='Email Address' value='email'/>
            </div>
            <div className='col-8 form-group mx-auto'>
                <input type="text" className='form-control' placeholder='Subject' value='subject'/>
            </div>
            <div className='col-8 form-group mx-auto'>
                <textarea className="form-control" id="" placeholder='Message' name='message'></textarea>
            </div>
            <div className='col-8 form-group mx-auto'>
                <input type="submit" className='form-control' value='Send Email'/>
            </div>
            </div>
            </form>
        </div>
    </div>
  )
}

