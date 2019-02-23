class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :messages
  has_many :group_users
  has_many :groups, through: :group_users
  has_many :messages

  # scope :other_than_current_user, -> { where.not(id: current_user.id) }
  # scope :json_search, -> { where('name LIKE(?)', "%#{params[:keyword]}%") }
  # scope :incremental_search -> { json_search.other_than_current_user }
end
