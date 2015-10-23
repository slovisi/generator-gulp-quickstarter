# Require any additional compass plugins here.


# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "dist/css"
sass_dir = "app/scss"
images_dir = "dist/img"
javascripts_dir = "dist/js"


# Uncomment the following line if you use webfonts,
# change the value to reflect your own structure
fonts_dir = "dist/font"


# environment = :development or :production
# environment = :production

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
# line_comments = (environment == :production) ? false : true

#
# sass_options = (environment == :production) ? {:debug_info => false} : {:debug_info => true}
