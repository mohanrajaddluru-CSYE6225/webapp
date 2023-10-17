
locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

variable "ami_name" {
  type    = string
  default = "test123"
}
variable "ami_region" {
  type    = string
  default = "us-east-1"
}
variable "login_username" {
  type    = string
  default = "admin"
}
variable "typeOfInstance" {
  type    = string
  default = "t2.micro"
}
variable "sourceAMIOwner" {
  type    = string
  default = "136693071363"
}
variable "AMIsharedOwnerID" {
  type    = string
  default = "171509565742"
}
packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "debian" {
  ami_name        = "${var.ami_name}-${local.timestamp}"
  instance_type   = "${var.typeOfInstance}"
  region          = "${var.ami_region}"
  ssh_username    = "${var.login_username}"
  ami_description = "created from packer"
  source_ami_filter {
    filters = {
      name                = "debian-*-*-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["${var.sourceAMIOwner}"]
  }
  ami_users = ["${var.AMIsharedOwnerID}"]

}



build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.debian"
  ]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    script = "./install.sh"
  }
}

