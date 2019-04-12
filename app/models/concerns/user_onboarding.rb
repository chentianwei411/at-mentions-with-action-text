module UserOnboarding
  extend ActiveSupport::Concern

  def onboarding_percent
    steps = [:twitter?, :has_team?]
    complete = steps.select{ |step| send(step)}
    complete.length / steps.length.to_f * 100
  end

  def has_team?
    teams.any?
  end
end
