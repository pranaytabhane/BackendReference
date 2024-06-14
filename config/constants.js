/**
 * Messages object containing various success and error messages for different scenarios.
 * @type {Object}
 */
export const  messages = {
  createAccount: "Your account create successfully.",
  failedAccount: "Your account create failed.",
  userExist: "User already exist.",
  userNotFound: "Please Check Your Credential.",
  dataNotFound: "No data found",
  incorrectPassword: "Incorrect Email or Password",
  passwordNotCreated: "Password Not Created",
  loginSuccess: "Login Successfully",
  listSuccess: "Data fetch successfully",
  updateSuccess: "Data update successfully",
  statusUpdate: "Status update successfully",
  internalServerError: "Internal Server Error",
  passwordChangeSuccess: "Password Change Successfully",
  profileUpdate: "Profile Setup Successfully",
  authError: "Auth Error: Authorization Token Required",
  tokenExpire: "Token Expire",
  invalidToken: "Invalid Token",
  internalError: "Internal Server Error",
  emailSend: "Email successfully send.",
  add: "Data Add successfully",
  emailNotVerified: "Email Not Verified",
  emailVerified: "Email Verified",
  emailAlreadyVerified: "Email Alredy Verified",
  emailSend: "Email Send Successfully.",
  userAlredyAdd: "User already add wait for approval.",
  userAdd: "User add success wait for approval.",
  notAuthorized: "Not authorized for this API route",
  requiredFields: "Enter all required fields",
  invalidCredentials: "Invalid Credentials.Confirm password does not match.",
  invalidUserType: "Invalid user type.",
  validationError: "Validation error",
  deleteSuccess: "Data deleted successfully",
  passwordHashingFailed:"Problem in password hashing.",
  emailSubject:"Verification OTP.",
  invalidOtp:"Invalid Otp.",
  otpExpired:"Otp is expired.",
  otpVerified:"Otp verification successfull.",
  sendOtpToEmail:"OTP has been sent successfully to registered email address.",
  userNotFoundWithEmail:"User not found with this email.",
  incorrectOldPassword:"Old password is not correct.",
  addFavourites:"Service added to your favourites.",
  removeFavourites:"Service remove from your favourites.",
  createAccountAndEmailSend: "Account created and verification email sent .",
  notVerified: "You are not verified, contact admin.",
  isVerifiedStatusSubject:"Profile verification status",
  profileVerified: "Your profile has been successfully verified. You can now access your profile.",
  profileUnverified: "Your profile marked unverified.",
  notificationStatusUpdate:"Notifiation status updated successfully.",
  bankDetailsAdded:"Bank details added successfully.",
  bankDetailsUpdated:"Bank details updated successfully.",
  ratingAdded:"Rating added successfully.",
  availabilityUpdated:'Availability updated successfully.',
  availabilityAdded:'Availability added successfully.',
  emailNotVerified:"Email not verified ,please verify your email first.",
  userNotExist:"User not exist with this email.",
  noUser:"User not found",
  userActivated:"User activated successfully",
  userDeactivated:"User deactivated successfully",
};

export const messageID = {
  //to be used when no new record is inserted but to display success message
  successCode: 200,
  //to be used when new record is inserted
  newResourceCreated: 201,
  //to be used if database query return empty record
  nocontent: 204,
  //to be used if the request is bad e.g. if we pass record id which does not exits
  badRequest: 400,
  //to be used when the user is not authorized to access the API e.g. invalid access token. "jwtTokenExpired": 401
  unAuthorizedUser: 401,
  //to be used when access token is not valid
  forbidden: 403,
  //to be used if something went wrong
  failureCode: 404,
  //to be used when error occured while accessing the API
  internalServerError: 500,
  //to be used if record already axists
  conflictCode: 409,
};
