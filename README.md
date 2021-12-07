# Running in development mode

To run the application in development mode on your localhost follow the following steps:

1. Go to the backend directory and install node modules

```sh
cd backend
npm i
```

2. Go to /app/config directory in the backend directory and change the env.json to the following lines

```json
{
  "backend": {
    "ip": "http://localhost",
    "port": 8080
  },
  "frontend": {
    "ip": "http://localhost",
    "port": 80
  }
}
```

3. Run the following command inside /backend directory to start the backend server

```sh
cd backend
npm start
```

4. Go to the frontend directory and install node modules

```sh
cd frontend
npm i
```

5. Go to /src/config directory in the frontend directory and change the env.json to the following lines

```json
{
  "backend": {
    "ip": "http://localhost",
    "port": 8080
  },
  "frontend": {
    "ip": "http://localhost",
    "port": 80
  }
}
```

6. Run the following command in /frontend directory to start the frontend server

```sh
cd frontend
npm start
```

# To run on cloud

1. Configure your terminal/ powershell/ command prompt to use your GCP project

```sh
gcloud init
```

1. Configure the create-cluster.sh script file with your GCP project name instead of "pragmatic-armor-334222" in all places it is given or use the GUI in cloud platform console to create a cluster.

2. Edit the above 2 env.json files with IP address of the load balancer you created instead of http://localhost

3. Run the cloud build command on terminal inside both the frontend and backend directories (direcotry in which Dockerfile is present) to build and push to your project's container registry.

```sh
gcloud builds submit --tag gcr.io/<your-project-ID>/<image-name-you-want>
```

4. Edit and run the deployment and service yaml files.

See the create-cluster.sh file you edited and ran for the cluster name and zone
"whiteboard-cluster" and "us-central1-c" in our case.

Change the containers' image attribute to names of the containers in your source repository.

```sh
gcloud container clusters get-credentials <your-cluster-name> --zone <zone-where-you-deployed>
kubectl apply -f gke-deployment.yaml
kubectl apply -f gke-service.yaml
```
5. That's all, your application is live.

6. To find the IP address go to GCP console, Google Kubernetes Engine, Services and Ingress, click on the name of your service, scroll down and find the external endpoints.

```<ip-address>:80``` for frontend
```<ip-address>:8080``` for backend

Click on ```<ip-address>```:80 to see the live application