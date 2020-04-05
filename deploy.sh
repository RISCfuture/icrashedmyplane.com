yarn build
rsync -rvz --delete --force dist/ deploy@www.timothymorgan.info:/var/www/www.icrashedmyplane.com/
