require 'rails_helper'

RSpec.describe "desks/edit", type: :view do
  before(:each) do
    @desk = assign(:desk, Desk.create!())
  end

  it "renders the edit desk form" do
    render

    assert_select "form[action=?][method=?]", desk_path(@desk), "post" do
    end
  end
end
