class StripeService
  require 'stripe'
  MEDIUM = 'price_1HqexCEQeVG9yGGObzsckmv0'

  def self.create_customer(current_user)
    Stripe.api_key = ENV["stripe_api_key"]
    company = CompanyAccount.find_by(team_id: current_user.team_id)
    stripe_users = Stripe::Customer.list()
    stripe_user =  stripe_users.find(email: company.main_email)
    if !stripe_user
      begin
        Stripe::Customer.create({description: "Subscription of #{company.title}", email: company.main_email, })
        puts "... create customer OK 🚀"
      rescue StandardError => e
        print "#{e} 💢💢💢"
      end
    end
  end

  def self.create_payment_method(current_user)
    Stripe.api_key = ENV["stripe_api_key"]
    begin
      company = CompanyAccount.find_by(team_id: current_user.team_id)
      stripe_users = Stripe::Customer.list()
      stripe_user =  stripe_users.find(team_id: current_user.team_id)
      stripe_user_id =  stripe_user.first.id
      card = CreditCard.find_by(company_account_id: company.id)
      exp_month = card.expiration_date[0] + card.expiration_date[1]
      exp_year = card.expiration_date[3] + card.expiration_date[4] + card.expiration_date[5] + card.expiration_date[6]

      customer_source = Stripe::Source.create({
                                                  type: 'card',
                                                  currency: 'eur',
                                                  owner: {
                                                      email: company.main_email,
                                                  },
                                                  card: {
                                                      number: "#{card.card_number}",
                                                      exp_month: exp_month,
                                                      exp_year: exp_year,
                                                  },
                                              })

      source = customer_source.first[1]
      Stripe::Customer.create_source(
          "#{stripe_user_id}",
          {source: "#{source}",})
      puts "... create payment_method OK 🚀"

    rescue StandardError => e
      print "#{e} 💢"
    end
  end

  def self.create_subscription(current_user, quantity, kind)
    Stripe.api_key = ENV["stripe_api_key"]
    company = CompanyAccount.find_by(team_id: current_user.team_id)
    stripe_users = Stripe::Customer.list()
    stripe_user =  stripe_users.find(email: company.main_email)
    stripe_user_id = stripe_user.first.id

    case kind
    when "SMALL"
      price = Stripe::Price.retrieve(ENV["stripe_medium_price"])
    when "MEDIUM"
      price = Stripe::Price.retrieve(ENV["stripe_medium_price"])
    when "LARGE"
      price = Stripe::Price.retrieve(ENV["stripe_medium_price"])
    end

    begin
      subscription = Stripe::Subscription.create({
                                                     customer: "#{stripe_user_id}",
                                                     trial_period_days: 30,
                                                     items: [
                                                         {
                                                             price: price,
                                                             quantity: quantity,
                                                         },
                                                     ],
                                                 })
      puts "... create subscription OK 🚀"
    rescue StandardError => e
      print "#{e} 💢"
    end
  end
end