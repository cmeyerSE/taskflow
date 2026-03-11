class Task < ApplicationRecord
    validates :title, presence: true
    validates :status, presence: true
    validates :priority, presence: true
end
