<script setup lang="ts">
import LineChart from "@/components/charts/LineChart.vue";
import AppCard from "@/components/ui/AppCard.vue";
import SmallBox from "@/components/ui/SmallBox.vue";
import { useNavSearch } from "@/composables/useNavSearch";
import { dashboardStats, orderStatusVariant, recentOrders, revenueChart } from "@/data/dashboard";

const { isFiltering, clear: clearSearch } = useNavSearch();
if (isFiltering.value) clearSearch();
</script>

<template>
  <div>
    <div class="row">
      <div v-for="stat in dashboardStats" :key="stat.label" class="col-lg-3 col-6">
        <SmallBox :label="stat.label" :variant="stat.variant" :icon="stat.icon" :to="stat.to">
          <template #value>
            {{ stat.value }}<sup v-if="stat.suffix" class="fs-5">{{ stat.suffix }}</sup>
          </template>
        </SmallBox>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-7">
        <AppCard title="Sales Value" class="mb-4">
          <LineChart
            :labels="revenueChart.labels"
            :datasets="revenueChart.datasets"
            aria-label="Area chart of digital goods and electronics sales, January to July 2023"
          />
        </AppCard>
      </div>

      <div class="col-lg-5">
        <AppCard title="Recent Orders" collapsible>
          <div class="table-responsive">
            <table class="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>
                    <span class="badge" :class="`text-bg-${orderStatusVariant[order.status]}`">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="text-end">{{ order.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
