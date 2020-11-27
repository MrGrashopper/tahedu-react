class Api::V1::SubscriptionsController < ApplicationController
  before_action :authenticate_user!
  PRICE_0 = "0.0"
  PRICE_1 = "3.49"
  PRICE_2 = "2.99"

  def create
    supervisor = Supervisor&.find_by(user_id: current_user.id, team_id: current_user.team_id)
    company_account = CompanyAccount.find_by(team_id: current_user.team_id)
    subscription = Subscription.find_by(company_account_id: company_account&.id)
    subsrciption_type = params[:subscription_type]
    team = UserTeamId.where(team_id: current_user.team_id)

    case subsrciption_type
    when "0"
      price = PRICE_0
      kind = "SMALL"
      quantity = 5
    when "1"
      price = PRICE_1
      kind = "MEDIUM"
      quantity = team.count
    when "2"
      price = PRICE_2
      kind = "LARGE"
      quantity = team.count < 50? 50 : team.count
    end

    if supervisor
      if !subscription
        Subscription.create(
            company_account_id: company_account.id,
            subscribed_by: current_user.email,
            price: price.to_f,
            quantity: quantity,
            kind: subsrciption_type.to_i
        )
      else
        subscription.update(
            company_account_id: company_account.id,
            subscribed_by: current_user.email,
            price: price.to_f,
            quantity: quantity,
            kind: subsrciption_type.to_i
        )
        StripeService.cancel_subscription(current_user)
      end
      redirect_to subscription_path, notice: '🚀 Abonniert!'
      StripeService.create_payment_method(current_user)
      StripeService.create_subscription(current_user, quantity.to_i, kind)
    else
      redirect_to root_path, notice: '😟 Nicht berechtigt'
    end
  end

  def destroy
    supervisor = Supervisor&.find_by(user_id: current_user.id, team_id: current_user.team_id)
    company_account = CompanyAccount.find_by(team_id: current_user.team_id)
    subscription = Subscription.find_by(company_account_id: company_account.id)

    if supervisor
      if subscription
        subscription.delete
        redirect_to subscription_path, notice: '😟 Abo beendet!'
        StripeService.cancel_subscription(current_user)
      end
    else
      redirect_to root_path, notice: '😟 Nicht berechtigt'
    end
  end
end
