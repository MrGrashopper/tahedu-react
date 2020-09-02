require 'rails_helper'

RSpec.describe "desks/index", type: :view do
  before(:each) do
    assign(:desks, [
      Desk.create!(),
      Desk.create!()
    ])
  end

  it "renders a list of desks" do
    render
  end
end
