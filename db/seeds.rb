# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
    dragos = User.create email: 'dragos.calin.gm@gmail.com',
                password: 'random2kx',
                password_confirmation: 'random2kx'

    new_york = dragos.locations.create latitude: 40.712783,
                longitude: -74.005941,
                current_location: false,
                summer_timezone: -4.0,
                winter_timezone: -5.0

    london = dragos.locations.create latitude: 51.50853,
                longitude: -0.12574,
                current_location: false,
                summer_timezone: 0.0,
                winter_timezone: 1.0
