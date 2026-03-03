MatchMake was designed as a website where an account can be created and resumes can be uploaded to get automatic insights. The current uploaded version is a work in progress and serves nothing more than a proof of concept. As such, the website contains the following limitations for now: the AI analysis is done on the client side rather than the backend (an API key to cerebras has been omitted from the code and requires one to work); the website has yet to support other features like the management of accounts (changing passwords, emails, deletion, etc.); the website has yet to implement the scoring feature; and various UX improvements, among others.

How to use:

REGISTRATION
Select register from the header, or select "Don't have an account" from the landing page
Enter valid email
Enter password (limitations make it so that it only supports up to 6 characters)
Confirm password
Select register
An email will be sent to the email address on field, press link, you will be redirected to an invalid link. Login after pressing link on email

ANALYSIS
Provide an API key for Cerebras in scripts/ai.js
Login to your account
Create a new job listing by selecting 'Create' in the header or the '+' sign in the home page
A job entry will be created in the home page, showing the information created and allowing actions such as editing, deleting, uploading resume, and viewing results
Press the upload symbol once the job shows up in the home page
Upload resume in .pdf format (IMPORTANT: as of the moment, the AI analysis is all done in the client side. We must wait for the screening to complete before exiting the page otherwise the analysis won't be completed)
View the results of the analysis by pressing the ranking/pedestal icon on the job tile

DELETION OF LISTINGS
On the job entry, select the trash icon
Confirm the deletion

EDITING OF LISTINGS
On the job entry, select the pencil icon
Edit as necessary
Select the finish button to finalize changes
