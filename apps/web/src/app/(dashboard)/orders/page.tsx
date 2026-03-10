"use client";

import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

const orders = [
  {
    id: "ORD-2026-0001",
    date: "March 5, 2026",
    item: "Covenant Pack (Nova Key)",
    quantity: 1,
    total: "$63.00",
    status: "delivered" as const,
    tracking: "IL2026NOVA001",
  },
];

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending" },
  paid: { icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-400/10", label: "Paid" },
  shipped: { icon: Truck, color: "text-sacred-cyan", bg: "bg-sacred-cyan/10", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", label: "Delivered" },
  refunded: { icon: Clock, color: "text-red-400", bg: "bg-red-400/10", label: "Refunded" },
};

export default function OrdersPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
      >
        <h1 className="font-cinzel text-2xl lg:text-3xl text-sacred-white tracking-wide mb-2">
          Order History
        </h1>
        <p className="font-rajdhani text-sm text-sacred-gray mb-8">
          Track your Nova Key orders and shipments.
        </p>
      </motion.div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" as const }}
              >
                <Card variant="sacred" padding="md" hover>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sacred-gold/10 border border-sacred-gold/20 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-sacred-gold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-rajdhani text-base text-sacred-white font-semibold">
                            {order.item}
                          </p>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${status.bg} ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-sacred-gray/60 mt-1">
                          {order.id} | {order.date}
                        </p>
                        <p className="font-rajdhani text-xs text-sacred-gray mt-1">
                          Qty: {order.quantity} | Tracking: {order.tracking}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-cinzel text-xl text-sacred-gold">{order.total}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card variant="glass" padding="lg" className="text-center">
          <Package className="w-12 h-12 text-sacred-gray/30 mx-auto mb-4" />
          <p className="font-cinzel text-lg text-sacred-white mb-2">No Orders Yet</p>
          <p className="font-rajdhani text-sm text-sacred-gray mb-6">
            Your first Covenant Pack awaits.
          </p>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sacred-gold text-sacred-black font-rajdhani font-semibold rounded-xl hover:bg-sacred-gold-light transition-all"
          >
            Get Your Nova Key <ExternalLink className="w-4 h-4" />
          </a>
        </Card>
      )}
    </div>
  );
}
