<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Clock3, Truck, UserRound, Utensils } from "lucide-vue-next";

import {
  Map,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from "@/components/ui/map";
import Card from "@/components/ui/Card.vue";
import CardHeader from "@/components/ui/CardHeader.vue";
import CardTitle from "@/components/ui/CardTitle.vue";
import CardContent from "@/components/ui/CardContent.vue";
import Badge from "@/components/ui/Badge.vue";
import Button from "@/components/ui/Button.vue";

interface DeliveryMeal {
  name: string;
  price: string;
  quantity: number;
}

interface OsrmRouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

const deliveryMeals: DeliveryMeal[] = [
  { name: "Spicy Tofu Grain Bowl", price: "$44.00", quantity: 1 },
  { name: "Herb Chicken Rice Box", price: "$58.00", quantity: 2 },
  { name: "Roasted Veggie Wrap", price: "$29.00", quantity: 1 },
];

const pickup = { lng: -122.466, lat: 37.716 };
const dropoff = { lng: -122.399, lat: 37.683 };

function formatDistance(meters?: number) {
  if (!meters) return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return "--";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

const routeData = ref<OsrmRouteData | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`,
    );
    const data = await response.json();
    const route = data?.routes?.[0];
    if (!route?.geometry?.coordinates) return;
    routeData.value = {
      coordinates: route.geometry.coordinates as [number, number][],
      duration: route.duration as number,
      distance: route.distance as number,
    };
  } catch (err) {
    console.error("Failed to fetch route:", err);
  } finally {
    loading.value = false;
  }
});

const progressCoordinates = computed<[number, number][]>(() => {
  const coords = routeData.value?.coordinates ?? [];
  const factor = routeData.value ? 0.62 : 0.66;
  const progressCount = Math.max(2, Math.floor(coords.length * factor));
  return coords.slice(0, progressCount);
});

const courierPosition = computed<[number, number] | undefined>(
  () => progressCoordinates.value[progressCoordinates.value.length - 1],
);
</script>

<template>
  <div class="p-8">
    <div
      class="bg-sidebar mx-auto grid max-w-7xl rounded-xl border md:h-[600px] md:grid-cols-[1.05fr_1fr]"
    >
      <!-- Left: order details -->
      <div class="flex flex-col p-5 md:p-6">
        <div class="space-y-1">
          <h3 class="text-2xl font-semibold tracking-tight">Track Delivery</h3>
          <p class="text-muted-foreground text-sm">Mon Feb 10 — 2-3 PM</p>
        </div>

        <Card class="mt-5">
          <CardHeader>
            <CardTitle class="font-medium">
              Order items ({{ deliveryMeals.length }})
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-5">
            <div
              v-for="meal in deliveryMeals"
              :key="meal.name"
              class="flex items-center gap-3"
            >
              <div
                class="bg-muted grid size-8 place-items-center rounded-full text-xs font-medium"
              >
                <Utensils class="text-muted-foreground size-4" />
              </div>
              <div class="min-w-4 flex-1">
                <p class="truncate pb-1 text-sm font-medium">{{ meal.name }}</p>
                <p class="text-muted-foreground text-xs">{{ meal.price }}</p>
              </div>
              <Badge variant="secondary" class="h-6 rounded-full px-2.5">
                x{{ meal.quantity }}
              </Badge>
            </div>
            <div
              class="border-border/60 flex items-center justify-between border-t pt-3 text-sm"
            >
              <span class="text-muted-foreground">Bundle total</span>
              <span class="font-medium">$189.00</span>
            </div>
          </CardContent>
        </Card>

        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent class="space-y-2">
              <p class="text-muted-foreground text-sm font-medium">
                Pickup confirmed
              </p>
              <p class="text-sm font-medium">Mon, Feb 10 at 1:48 PM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="space-y-2">
              <p class="text-muted-foreground text-sm font-medium">
                Remaining travel
              </p>
              <p class="text-sm font-medium">
                {{ formatDuration(routeData?.duration) }}
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-2">
          <Button size="sm">
            <Clock3 class="size-4" />
            View timeline
          </Button>
          <Button variant="outline" size="sm">
            <UserRound class="size-4" />
            Contact courier
          </Button>
        </div>
      </div>

      <!-- Right: map -->
      <div
        class="relative h-[400px] overflow-hidden rounded-xl shadow-sm md:h-full"
      >
        <ClientOnly>
          <Map
            :loading="loading"
            :center="[-122.435, 37.696]"
            :zoom="12"
            :min-zoom="10"
            :max-zoom="16"
            :styles="{
              light: 'https://tiles.openfreemap.org/styles/bright',
              dark: 'https://tiles.openfreemap.org/styles/dark',
            }"
          >
            <MapRoute
              id="delivery-full-route"
              :coordinates="routeData?.coordinates ?? []"
              color="#5b6572"
              :width="5.2"
              :opacity="0.3"
              :interactive="false"
            />
            <MapRoute
              id="delivery-progress-route"
              :coordinates="progressCoordinates"
              color="#3b82f6"
              :width="6"
              :opacity="0.95"
              :interactive="false"
            />

            <MapMarker
              v-if="courierPosition"
              :longitude="courierPosition[0]"
              :latitude="courierPosition[1]"
              :offset="[0, 10]"
            >
              <MarkerContent>
                <div
                  class="relative grid size-9 place-items-center rounded-full bg-emerald-500 dark:bg-emerald-600"
                >
                  <Truck class="size-4 text-white" />
                </div>
              </MarkerContent>
              <MarkerTooltip>
                <div class="space-y-0.5 text-xs">
                  <p class="font-medium">
                    Order {{ formatDuration(routeData?.duration) }} away
                  </p>
                  <p class="text-background/70">
                    Route {{ formatDistance(routeData?.distance) }}
                  </p>
                </div>
              </MarkerTooltip>
            </MapMarker>

            <MapMarker :longitude="pickup.lng" :latitude="pickup.lat">
              <MarkerContent>
                <div
                  class="size-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
                />
              </MarkerContent>
              <MarkerTooltip>Origin</MarkerTooltip>
            </MapMarker>

            <MapMarker :longitude="dropoff.lng" :latitude="dropoff.lat">
              <MarkerContent>
                <div
                  class="size-4 rounded-full border-2 border-white bg-rose-500 shadow-sm"
                />
              </MarkerContent>
              <MarkerTooltip>Destination</MarkerTooltip>
            </MapMarker>
          </Map>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
