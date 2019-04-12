class User < ApplicationRecord
  include ActionText::Attachable
  include UserOnboarding

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :masqueradable, :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :omniauthable

  has_person_name

  has_many :notifications, foreign_key: :recipient_id
  has_many :services
  has_many :teams

  def to_trix_content_attachment_partial_path
    to_partial_path
  end

end
