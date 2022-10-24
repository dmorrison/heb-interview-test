# Introduction

Hello! This is the submission for the H-E-B Digital interview take-home project from Derek Morrison (me@derek-morrison.com).

# Running the Project

1. Clone this repository.
1. Run `npm install`.
1. Run `npm run dev`.
1. View the project at localhost:3000.

The users are hard-coded as mock data, and here are a couple to test:
- Account #: 1111; PIN: 1234
- Account #: 2222; PIN: 1234

I tested the app using Node 18.11.0 and NPM 8.19.2 on macOS 12.6 (Intel architecture).

# Problem Description

Provide a basic ATM (Automated Teller Machine) implementation. At a minimum, this program should offer the following features:

- Enter a PIN to identify a unique customer
- Query and show the current account balance
- Simulate the withdrawal of cash
- Simulate a deposit
- A daily withdrawal limit

# Known Issues

- The passwords for mock data are stored and compared in plain text. For security, you'd want to store a hash of passwords and compare that.
- User data is stored in the session cookie. Even though the session is encrypted, I'm not sure you'd want to store potentially sensitive user info like this (and instead you might want to look it up again from the db or cache more securely).

# Ideas for Improvement

- Improve form validation for login form. Currently, it only checks if fields are blank.
