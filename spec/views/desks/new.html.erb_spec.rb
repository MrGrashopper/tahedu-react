require 'rails_helper'

RSpec.describe "desks/new", type: :view do
  before(:each) do
    assign(:desk, Desk.new())
  end

  it "renders new desk form" do
    render

    assert_select "form[action=?][method=?]", desks_path, "post" do
    end
  end
end
