class Task < ApplicationRecord
    belongs_to :user
    
    before_validation :normalize_status_and_priority

    validates :title, presence: true
    validates :status, presence: true
    validates :priority, presence: true

    private

    def normalize_status_and_priority
        self.status = status.to_s.strip.downcase
        self.priority = priority.to_s.strip.downcase

        self.status =
            case status
            when "to do", "to_do"
                "todo"
            when "in progress"
                "in_progress"
            when "completed", "complete"
                "done"
            when "", nil
                "todo"
            else
                status
            end

        self.priority = "medium" if priority.blank?
    end
end
