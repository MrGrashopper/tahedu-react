class UserMailer < ApplicationMailer
  def welcome_email(user, company)
    @user = user
    @company = company
    mail(to: @user.email, subject: "Einladung von #{@company.title}")
  end
end
