/*
 * EtsyMargin fee calculator
 * Rates verified against Etsy's published fee schedule (etsy.com/legal/fees).
 * Non-US/UK regulatory-fee and VAT figures are representative averages —
 * see the blog for country-by-country detail. Update FEE_SCHEDULES below
 * if Etsy changes its published rates.
 */
(function () {
  "use strict";

  var LISTING_FEE = 0.20; // billed in USD-equivalent everywhere

  var FEE_SCHEDULES = {
    US: { label: "United States", symbol: "$",  transaction: 0.065, procPct: 0.03, procFlat: 0.25, regulatory: 0,     vatApplies: false, vatRate: 0,    adsThreshold: 10000 },
    UK: { label: "United Kingdom", symbol: "£",  transaction: 0.065, procPct: 0.04, procFlat: 0.20, regulatory: 0.004, vatApplies: true,  vatRate: 0.20, adsThreshold: 8000  },
    CA: { label: "Canada",         symbol: "C$", transaction: 0.065, procPct: 0.03, procFlat: 0.25, regulatory: 0,     vatApplies: false, vatRate: 0,    adsThreshold: 13000 },
    AU: { label: "Australia",      symbol: "A$", transaction: 0.065, procPct: 0.03, procFlat: 0.25, regulatory: 0,     vatApplies: false, vatRate: 0,    adsThreshold: 15000 },
    EU: { label: "Eurozone",       symbol: "€",  transaction: 0.065, procPct: 0.04, procFlat: 0.30, regulatory: 0.009, vatApplies: true,  vatRate: 0.20, adsThreshold: 9000  }
  };

  var $ = function (id) { return document.getElementById(id); };
  var num = function (id) { var v = parseFloat($(id).value); return isNaN(v) || v < 0 ? 0 : v; };

  function fmt(schedule, n) {
    var sign = n < 0 ? "-" : "";
    return sign + schedule.symbol + Math.abs(n).toFixed(2);
  }

  function calculate() {
    var country = $("country").value;
    var schedule = FEE_SCHEDULES[country];

    var price = num("price");
    var shipCharged = num("shipCharged");
    var shipCost = num("shipCost");
    var materialCost = num("materialCost");
    var qty = num("qty");
    var fixedCosts = num("fixedCosts");

    var vatRegistered = $("vatRegistered") ? $("vatRegistered").checked : false;
    var offsiteAd = $("offsiteAd").checked;
    var overThreshold = $("overThreshold").checked;
    var etsyPlus = $("etsyPlus").checked;

    var orderTotal = price + shipCharged;
    var transactionFee = orderTotal * schedule.transaction;
    var processingFee = orderTotal * schedule.procPct + (orderTotal > 0 ? schedule.procFlat : 0);
    var regulatoryFee = orderTotal * schedule.regulatory;
    var feesBeforeVat = LISTING_FEE + transactionFee + processingFee + regulatoryFee;
    var vatOnFees = (schedule.vatApplies && !vatRegistered) ? feesBeforeVat * schedule.vatRate : 0;

    var adsFee = 0;
    if (offsiteAd && orderTotal > 0) {
      var rate = overThreshold ? 0.12 : 0.15;
      adsFee = Math.min(orderTotal * rate, 100);
    }

    var totalFees = feesBeforeVat + vatOnFees + adsFee;
    var costs = materialCost + shipCost;
    var netProfit = orderTotal - totalFees - costs;
    var margin = orderTotal > 0 ? (netProfit / orderTotal) * 100 : 0;

    var monthlyProfit = netProfit * qty - (etsyPlus ? 10 : 0);
    var breakEven = (fixedCosts > 0 && netProfit > 0) ? Math.ceil(fixedCosts / netProfit) : null;

    render(schedule, {
      price: price, shipCharged: shipCharged, orderTotal: orderTotal,
      listingFee: LISTING_FEE, transactionFee: transactionFee, processingFee: processingFee,
      regulatoryFee: regulatoryFee, vatOnFees: vatOnFees, adsFee: adsFee, totalFees: totalFees,
      costs: costs, netProfit: netProfit, margin: margin,
      qty: qty, monthlyProfit: monthlyProfit, breakEven: breakEven,
      vatApplies: schedule.vatApplies, offsiteAd: offsiteAd
    });
  }

  function render(schedule, r) {
    $("outListingFee").textContent = fmt(schedule, r.listingFee);
    $("outTransactionFee").textContent = fmt(schedule, r.transactionFee);
    $("outProcessingFee").textContent = fmt(schedule, r.processingFee);

    var regRow = $("rowRegulatory");
    if (schedule.regulatory > 0) {
      regRow.style.display = "";
      $("outRegulatoryFee").textContent = fmt(schedule, r.regulatoryFee);
    } else {
      regRow.style.display = "none";
    }

    var vatRow = $("rowVat");
    if (r.vatApplies) {
      vatRow.style.display = "";
      $("outVat").textContent = fmt(schedule, r.vatOnFees);
    } else {
      vatRow.style.display = "none";
    }

    var adsRow = $("rowAds");
    if (r.offsiteAd) {
      adsRow.style.display = "";
      $("outAds").textContent = fmt(schedule, r.adsFee);
    } else {
      adsRow.style.display = "none";
    }

    $("outTotalFees").textContent = fmt(schedule, r.totalFees);
    $("outCosts").textContent = fmt(schedule, r.costs);
    $("outNetProfit").textContent = fmt(schedule, r.netProfit);
    $("outMargin").textContent = r.margin.toFixed(1) + "%";

    var monthlyRow = $("rowMonthly");
    if (r.qty > 0) {
      monthlyRow.style.display = "";
      $("outMonthly").textContent = fmt(schedule, r.monthlyProfit);
    } else {
      monthlyRow.style.display = "none";
    }

    var beRow = $("rowBreakeven");
    if (r.breakEven !== null) {
      beRow.style.display = "";
      $("outBreakeven").textContent = r.breakEven + " units";
    } else {
      beRow.style.display = "none";
    }

    $("outOrderTotal").textContent = fmt(schedule, r.orderTotal);
  }

  function onCountryChange() {
    var country = $("country").value;
    var schedule = FEE_SCHEDULES[country];
    document.querySelectorAll(".currency-label").forEach(function (el) {
      el.textContent = schedule.symbol;
    });
    var vatField = $("vatField");
    if (vatField) vatField.style.display = schedule.vatApplies ? "" : "none";
    calculate();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = $("calcForm");
    if (!form) return;
    form.addEventListener("input", calculate);
    form.addEventListener("change", calculate);
    $("country").addEventListener("change", onCountryChange);
    onCountryChange();
  });
})();
