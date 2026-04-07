const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getLowStockAlerts = async (req, res) => {
  const { companyId } = req.params;

  try {
    if (!companyId || isNaN(companyId)) {
      return res.status(400).json({ error: "Invalid companyId" });
    }

    const products = await prisma.product.findMany({
      where: {
        companyId: parseInt(companyId),
      },
      include: {
        inventory: {
          include: { warehouse: true },
        },
        suppliers: {
          include: { supplier: true },
        },
      },
    });

    const alerts = [];

    for (const product of products) {
      const sales = await prisma.sale.aggregate({
        _sum: { quantity: true },
        where: {
          productId: product.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const totalSales = sales._sum.quantity || 0;

      if (totalSales === 0) continue;

      for (const inv of product.inventory) {
        if (inv.quantity < product.lowStockThreshold) {
          const avgDaily = totalSales / 30;

          const days =
            avgDaily > 0 ? Math.floor(inv.quantity / avgDaily) : null;

          alerts.push({
            product_id: product.id,
            product_name: product.name,
            sku: product.sku,
            warehouse_id: inv.warehouse.id,
            warehouse_name: inv.warehouse.name,
            current_stock: inv.quantity,
            threshold: product.lowStockThreshold,
            days_until_stockout: days,
            supplier: product.suppliers?.length
              ? {
                  id: product.suppliers[0].supplier.id,
                  name: product.suppliers[0].supplier.name,
                  contact_email: product.suppliers[0].supplier.contactEmail,
                }
              : null,
          });
        }
      }
    }

    res.json({
      alerts,
      total_alerts: alerts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
