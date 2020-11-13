module ApplicationHelper
  def flash_messages
    flash.map do |type, text|
      { id: text.object_id, type: type, text: text }
    end
  end

  def current_class?(test_path)
    request.path == test_path ? 'li-bg' : ''
  end
end
