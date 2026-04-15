Rails.application.config.session_store :cookie_store,
  key: "_taskflow_session",
  secure: Rails.env.production?,
  same_site: Rails.env.production? ? :none : :lax,
  httponly: true