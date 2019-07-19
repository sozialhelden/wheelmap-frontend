run: build
	docker run \
	  -a STDOUT \
		-a STDERR \
		--restart=always \
		--env-file .env \
		--net=host \
		-p 3000:3000 \
		wheelmap-react-frontend

build:
	docker build -t wheelmap-react-frontend .

push: build
	docker tag wheelmap-react-frontend sozialhelden/wheelmap-react-frontend:${npm_package_version}
	docker tag wheelmap-react-frontend sozialhelden/wheelmap-react-frontend:latest
	docker push sozialhelden/wheelmap-react-frontend:${npm_package_version}
	docker push sozialhelden/wheelmap-react-frontend:latest

deploy: push
	kubectl apply -f k8s
	kubectl rollout restart deployment/wheelmap-react-frontend