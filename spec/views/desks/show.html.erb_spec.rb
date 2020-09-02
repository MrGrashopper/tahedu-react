require 'rails_helper'

RSpec.describe "desks/show", type: :view do
  before(:each) do
    @desk = assign(:desk, Desk.create!())
  end

  it "renders attributes in <p>" do
    render
  end
end
