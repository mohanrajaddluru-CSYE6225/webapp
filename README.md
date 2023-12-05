# webapp

integration workflow check the webapp tests

packer validate and packer fmt workflow check the packer file

Merge to main triggers the packer build

After packer build ami is created at the provided AWS location given in repo variables

webapp.service runs the webapp application as a inti script

Webapp Creates users from /opt/users.csv file

Demo Change

Assignment8 Demo

Command to add the SSL Certificate from local to aws account

aws acm import-certificate --certificate <certificate.pem> --certificate-chain <ca_bundle.pem> --private-key <privatekey.pem> --profile <AWS profile saved in local > --region <AWS certificate Region>

example use
aws acm import-certificate --certificate file://certificate_base64.txt --certificate-chain file://cabundle_base64.txt --private-key file://private_base64.txt --profile mohan-demo-iam --region us-east-1

Changes for readme

