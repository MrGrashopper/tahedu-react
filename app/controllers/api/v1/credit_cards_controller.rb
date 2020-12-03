class Api::V1::CreditCardsController < ApplicationController
  before_action :authenticate_user!

  def create
    supervisor = Supervisor&.find_by(user_id: current_user.id, team_id: current_user.team_id)
    if supervisor
      company_account = CompanyAccount.find_by(team_id: current_user.team_id)
      company_card = CreditCard.find_by(company_account_id: company_account.id)
      card_number = params[:card_number]
      exp_month = params[:exp_month]
      exp_year = params[:exp_year]
      cvv = params[:cvv]
      card_holder = params[:card_holder]

      exp_month = "0" + exp_month if exp_month.length < 2
      expiration = params[:exp_month].length >= 1? exp_month + "/" + exp_year : company_card.expiration_date

      if company_card
        card_number = card_number.length > 1? card_number : company_card.card_number
        card_holder = card_holder.length > 1? card_holder : company_card.card_holder
        cvv = cvv.length >= 3? cvv : company_card.ccv

        company_card.update(
            card_number: card_number,
            card_holder: card_holder,
            expiration_date: expiration,
            ccv: cvv)
      else
        CreditCard.create(
            company_account_id: company_account.id,
            card_number: card_number,
            card_holder: card_holder,
            expiration_date: expiration,
            ccv: cvv)
      end
      redirect_to subscription_path, notice: 'Gespeichert'
    else
      redirect_to root_path, notice: 'Nicht berechtigt'
    end
  end
end
