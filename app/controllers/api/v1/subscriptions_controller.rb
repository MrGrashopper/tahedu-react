class Api::V1::SubscriptionsController < ApplicationController
  before_action :authenticate_user!
  PRICE_0 = "0.0"
  PRICE_1 = "3.49"
  PRICE_2 = "2.99"

  def create
    supervisor = Supervisor&.find_by(user_id: current_user.id, team_id: current_user.team_id)
    company_account = CompanyAccount.find_by(team_id: current_user.team_id)
    subscription = Subscription.find_by(company_account_id: company_account.id)
    subsrciption_type = params[:subscription_type]
    quantity = UserTeamId.where(team_id: current_user.team_id).count

    case subsrciption_type
    when "0"
      price = PRICE_0
    when "1"
      price = PRICE_1
    when "2"
      price = PRICE_2
    end

    if supervisor
      if !subscription
        Subscription.create(
            company_account_id: company_account.id,
            subscribed_by: current_user.email,
            price: price.to_f,
            quantity: quantity.to_i,
            kind: subsrciption_type.to_i
        )
      else
        subscription.update(
            company_account_id: company_account.id,
            subscribed_by: current_user.email,
            price: price.to_f,
            quantity: quantity.to_i,
            kind: subsrciption_type.to_i
        )
      end
      redirect_to subscription_path, notice: 'Abonniert!'
    else
      redirect_to root_path, notice: 'Nicht berechtigt'
    end
  end
end
