# webapp

integration workflow check the webapp tests

packer validate and packer fmt workflow check the packer file

Merge to main triggers the packer build

After packer build ami is created at the provided AWS location given in repo variables

webapp.service runs the webapp application as a inti script

Webapp Creates users from /opt/users.csv file

Demo Change

