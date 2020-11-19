class StripeService
  require 'stripe'

  def self.create_customer
    Stripe.api_key = ENV["stripe_api_key"]
    Stripe::Customer.create({description: 'test user', email: 'test@test.de', })
  end
end