let currentMailbox = 'inbox';

document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send)
  // By default, load the inbox
  load_mailbox('inbox');


});


function compose_email() {

  document.querySelector('#singlemail-view').style.display = 'none';
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function display(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#singlemail-view').style.display = 'block';

      if (email.read == false){
        fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify(
            { read: true }
          )
        })
      }

      document.querySelector('#singlemail-view').innerHTML = '';

      const email_details = document.createElement('div');
      email_details.className = 'email_details';
      email_details.innerHTML = `
          <h2 class="sender">From: ${email.sender}</h2>
          <h2 class="recipients">to: ${email.recipients.join(', ')}</h2>
          <h6 class="timestamp">${email.timestamp}</h6>
          <h3 class="subject">Subject: ${email.subject}</h3>
          <h6 class="body"> body: </h6>
          <div class="body-container">${email.body}</div>`;
      document.querySelector('#singlemail-view').append(email_details);

      const archiveButton = document.createElement('button');
      console.log('Archive button created:', archiveButton);

      archiveButton.className = 'btn btn-primary';
      archiveButton.id = 'archive-button';
      
      console.log('current mailbox:',currentMailbox);
      if (currentMailbox !== 'sent') {

        if (email.archived) {
        archiveButton.innerText = 'Unarchive';
        archiveButton.style.backgroundColor = 'green';
        } else {
        archiveButton.innerText = 'Archive';
        archiveButton.style.backgroundColor='gray';
        }
      archiveButton.addEventListener('click', function() {
        archive(email.id, email.archived);
      });
      document.querySelector('#singlemail-view').append(archiveButton);
    } else {
      console.log('Email is in "sent" folder; archive button not added');
    }
  });
}

function archive(id, isArchived) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !isArchived
    })
  })
  .then(() => {
     load_mailbox('inbox');
  });
}

function load_mailbox(mailbox) {
  currentMailbox = mailbox;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(`Emails in ${mailbox}:`, emails);
    emails.forEach(email => {
      // CREATE HTML ELEMENT
      const emailcontainer = document.createElement('div');
      emailcontainer.className = 'email-container';
      // Debugging: Check the value of email.read
      console.log(`Email ID: ${email.id}, Read Status: ${email.read}`);

      if( email.read == true){
        emailcontainer.classList.add('read');
      } else {
        emailcontainer.classList.add('unread');
      }
      emailcontainer.innerHTML = `
          <div class="from"><strong>From:</strong> ${email.sender}</div>
          <div class="subject"><strong>Subject:</strong> ${email.subject}</div>
          <div class="timestamp"><strong>Timestamp:</strong> ${email.timestamp}</div>`;
      document.querySelector('#emails-view').append(emailcontainer);
      emailcontainer.onclick = function() {
      display(email.id)
  };
  });  
  })
  // .catch(error => {
  //   console.log('Error:', error);
  // });
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#singlemail-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}


function send(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  // API POST
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  });
}
