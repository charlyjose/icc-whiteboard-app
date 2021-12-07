gcloud beta container --project "pragmatic-armor-334222" /
clusters create "whiteboard-cluster" --zone "us-central1-c" /
--no-enable-basic-auth --cluster-version "1.21.5-gke.1302" /
--release-channel "regular" --machine-type "e2-medium" /
--image-type "COS_CONTAINERD" --disk-type "pd-standard" /
--disk-size "100" --metadata disable-legacy-endpoints=true /
--scopes "https://www.googleapis.com/auth/devstorage.read_only",/
"https://www.googleapis.com/auth/logging.write",/
"https://www.googleapis.com/auth/monitoring",/
"https://www.googleapis.com/auth/servicecontrol",/
"https://www.googleapis.com/auth/service.management.readonly",/
"https://www.googleapis.com/auth/trace.append" /
--max-pods-per-node "110" --num-nodes "3" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM --enable-ip-alias /
--network "projects/pragmatic-armor-334222/global/networks/default" /
--subnetwork "projects/pragmatic-armor-334222/regions/us-central1/subnetworks/default" /
--no-enable-intra-node-visibility --default-max-pods-per-node "110" --enable-autoscaling --min-nodes "2" /
--max-nodes "5" --no-enable-master-authorized-networks /
--addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver /
--enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 /
--enable-shielded-nodes --node-locations "us-central1-c"