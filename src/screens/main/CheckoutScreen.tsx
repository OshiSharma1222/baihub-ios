// Checkout Screen - Payment and address selection

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Plan } from '../../types/home.types';
import { Address, Order } from '../../api/endpoints';
import { logger } from '../../utils/logger';
import { AddressBottomSheet } from '../../components/common/AddressBottomSheet';
import { homeApi } from '../../api/endpoints';
import RazorpayCheckout from 'react-native-razorpay';
import { baihubAnalytics } from '../../services/baihub-analytics.service';
import { toast } from '../../utils/toast';

type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;
type CheckoutNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

// Format price to Indian Rupees
const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function CheckoutScreen() {
  const route = useRoute<CheckoutRouteProp>();
  const navigation = useNavigation<CheckoutNavigationProp>();
  const insets = useSafeAreaInsets();
  const { areaId, categoryId, areaName, categoryName, serviceId, timeSlots, plan } = route.params;

  const [showAddressSheet, setShowAddressSheet] = useState(false);
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [processingOrder, setProcessingOrder] = useState(false);

  const openRazorpayCheckout = useCallback(
    async (order: Order) => {
      if (!order.meta?.razorpayOrder) {
        logger.error('Razorpay order details missing');
        toast.error('Payment details not available. Please try again.');
        return;
      }

      const razorpayOrder = order.meta.razorpayOrder;

      // IMPORTANT: For postpaid plans with booking amount, the backend MUST create
      // the Razorpay order with the booking amount (not the full plan amount).
      // The frontend validates this and prevents payment if there's a mismatch.
      // Check if this is a postpaid plan with booking amount
      const isPostpaid = plan.isPostpaid === true;
      // Calculate booking amount considering number of slots
      // For full-time services (timeSlots.length === 0), use booking amount directly (not multiplied)
      // For slot-based services (timeSlots.length > 0), multiply by number of slots
      const isFullTimeService = timeSlots.length === 0;
      const numberOfSlots = timeSlots.length > 0 ? timeSlots.length : 0;
      
      // Handle bookingAmount as number or string (backend might send it as string)
      const bookingAmountRaw = plan.bookingAmount;
      let calculatedBookingAmount: number | undefined = bookingAmountRaw !== undefined && bookingAmountRaw !== null
        ? (typeof bookingAmountRaw === 'string' ? parseFloat(bookingAmountRaw) : bookingAmountRaw)
        : undefined;
      
      // Multiply by numberOfSlots only for slot-based services
      if (calculatedBookingAmount !== undefined && !isFullTimeService && numberOfSlots > 0) {
        calculatedBookingAmount = calculatedBookingAmount * numberOfSlots;
      }
      
      // If bookingAmount is not provided but bookingPercentage is, calculate it
      if (isPostpaid && (calculatedBookingAmount === undefined || isNaN(calculatedBookingAmount)) && plan.bookingPercentage !== undefined && plan.bookingPercentage !== null) {
        // Calculate booking amount from total (which already includes slot multiplication if applicable)
        calculatedBookingAmount = (total * plan.bookingPercentage) / 100;
        logger.info('Calculated booking amount from percentage', {
          bookingPercentage: plan.bookingPercentage,
          planTotal: plan.price.total,
          numberOfSlots,
          bookingAmountPerSlot,
          calculatedBookingAmount,
        });
      }
      
      const expectedAmountInPaise = isPostpaid && calculatedBookingAmount !== undefined && calculatedBookingAmount !== null && !isNaN(calculatedBookingAmount)
        ? Math.round(calculatedBookingAmount * 100) // Convert to paise (round to avoid floating point issues)
        : Math.round(total * 100); // Full amount in paise (total already includes numberOfSlots)

      // Verify that Razorpay order amount matches expected amount
      // For postpaid plans, backend should create Razorpay order with booking amount
      if (isPostpaid && calculatedBookingAmount !== undefined && calculatedBookingAmount !== null && !isNaN(calculatedBookingAmount)) {
        if (razorpayOrder.amount !== expectedAmountInPaise) {
          const errorMessage = `Payment configuration error: The backend created a Razorpay order for ₹${(razorpayOrder.amount / 100).toFixed(2)}, but for this postpaid plan, only the booking amount of ₹${calculatedBookingAmount.toFixed(2)} should be charged. Please contact support or try again later.`;
          
          logger.error('Razorpay order amount mismatch for postpaid plan - Payment blocked', {
            expected: expectedAmountInPaise,
            actual: razorpayOrder.amount,
            expectedInRupees: calculatedBookingAmount,
            actualInRupees: razorpayOrder.amount / 100,
            calculatedBookingAmount,
            planTotal: plan.price.total,
            numberOfSlots,
            message: 'Backend should create Razorpay order with booking amount for postpaid plans',
          });
          
          // Prevent payment and show error to user
          toast.error(
            `Payment configuration error. Expected booking amount: ₹${calculatedBookingAmount.toFixed(2)}, but received: ₹${(razorpayOrder.amount / 100).toFixed(2)}. Please contact support.`,
            'Payment Error'
          );
          return; // Stop payment process
        } else {
          logger.info('Postpaid plan: Using booking amount for Razorpay payment', {
            calculatedBookingAmount,
            amountInPaise: razorpayOrder.amount,
            planTotal: plan.price.total,
            numberOfSlots,
          });
        }
      }

      // TODO: get these from your logged-in user profile
      const userName = 'Arpit Jain';
      const userEmail = 'arpit@example.com';
      const userPhone = '9999999999';

      // Build description based on payment type
      const paymentDescription = isPostpaid && bookingAmount !== undefined && bookingAmount !== null
        ? `Booking amount for ${categoryName} (Postpaid Plan)`
        : `Payment for ${categoryName}`;

      const options: any = {
        description: paymentDescription,
        currency: razorpayOrder.currency || 'INR',
        key: razorpayOrder.rzp_key,              // ✅ from backend
        amount: razorpayOrder.amount.toString(), // ✅ paise as string (booking amount for postpaid)
        name: 'BaiHub',
        order_id: razorpayOrder.id,              // ✅ "order_xxx"
        prefill: {
          email: userEmail,
          contact: userPhone,
          name: userName,
        },
        theme: { color: '#f9cb00' },
      };

      logger.info('Razorpay options', JSON.stringify(options));
      logger.info('Razorpay order', JSON.stringify(razorpayOrder));
      logger.info('Order full', JSON.stringify(order));

      // Log analytics event - pay_now_clicked (when Razorpay checkout opens)
      try {
        logger.info('Logging pay_now_clicked event', {
          order_id: order.id,
          plan_id: plan.id,
          area_id: areaId,
          isPostpaid,
          bookingAmount,
        });
        // Calculate the actual amount being charged
        // For postpaid plans, use booking amount; for prepaid, use Razorpay order amount
        const actualChargeAmount = isPostpaid && calculatedBookingAmount !== undefined && calculatedBookingAmount !== null
          ? calculatedBookingAmount
          : razorpayOrder.amount / 100; // Convert from paise to rupees

        await baihubAnalytics.logPayNowClicked({
          area_id: areaId,
          area_name: areaName,
          service_id: categoryId,
          service_name: categoryName,
          came_from: categoryId ? 'area_wise_listing' : 'service_wise_listing',
          plan_id: plan.id,
          plan_amount: originalPrice, // Already multiplied by numberOfSlots
          plan_discount: discount, // Already multiplied by numberOfSlots
          plan_total: total, // Already multiplied by numberOfSlots
          plan_title: plan.title,
          plan_description: plan.description,
          selected_slots_ids: timeSlots.map(s => s.id),
          selected_slots_titles: timeSlots.map(s => s.displayText),
          order_total: actualChargeAmount, // Booking amount for postpaid, full amount for prepaid
          order_id: order.id,
          user_address: savedAddress ? `${savedAddress.addressLine1}, ${savedAddress.city}` : undefined,
        });
        logger.info('pay_now_clicked event logged successfully');
      } catch (error: any) {
        logger.error('Failed to log pay_now_clicked event', {
          error: error?.message || String(error),
          stack: error?.stack,
        });
      }

      try {
        const razorpayResponse = await RazorpayCheckout.open(options);
        logger.info('Razorpay payment success', razorpayResponse);

        navigation.navigate('AfterPayment', {
          orderId: order.id,
          paymentId: razorpayResponse.razorpay_payment_id,
        });
      } catch (error: any) {
        logger.error('Razorpay payment error', {
          raw: error,
          message: error?.message,
          description: error?.description,
          code: error?.code,
        });

        if (error?.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please check your internet connection.');
        } else if (error?.code === 'INVALID_OPTIONS') {
          toast.error('Invalid payment options. Please contact support.');
        } else if (error?.description) {
          if (error.description !== 'User closed the checkout form') {
            toast.error(error.description || 'Payment failed. Please try again.');
          }
        } else if (error?.message) {
          toast.error(error.message);
        }
      }
    },
    [categoryName, navigation, areaId, areaName, categoryId, plan, timeSlots, savedAddress]
  );

  const processOrder = useCallback(async (address: Address) => {
    if (!address.id) {
      logger.error('Address ID is missing');
      toast.error('Address ID is missing. Please try again.');
      return;
    }

    try {
      setProcessingOrder(true);
      
      // Format today's date as YYYY-MM-DD for the slots
      const today = new Date();
      const slotDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Build time slots array from selected slots
      const orderTimeSlots = timeSlots.map((slot) => ({
        timeSlotId: slot.id, // Time slot ID from route params (now from backend)
        slotDate: slotDate, // Today's date (can be updated to allow date selection)
      }));
      
      // Build notes with all selected time slots
      const timeSlotsText = timeSlots.length > 0 
        ? timeSlots.map(s => s.displayText).join(', ')
        : 'No time slots required';
      
      const orderData = {
        planId: plan.id,
        addressId: address.id,
        categoryId: categoryId,
        areaId: areaId, // Include areaId from route params
        serviceId: serviceId, // Include serviceId if provided
        timeSlots: orderTimeSlots,
        slots: timeSlots.length, // Number of slots selected (0 if not required)
        meta: {
          paymentMethod: 'card',
          notes: `Service: ${categoryName}, Area: ${areaName}${timeSlots.length > 0 ? `, Time slots: ${timeSlotsText}` : ''}`,
        },
      };

      const response = await homeApi.createOrder(orderData);
      if (response.data) {
        logger.info('Order created successfully', response.data);
        
        // Check order status and payment requirements
        const orderStatus = response.data.status;
        const hasRazorpayOrder = !!response.data.meta?.razorpayOrder;
        
        // Determine if payment is needed:
        // 1. Free plan: totalAmount = 0, status = SUCCESS, no Razorpay
        // 2. Postpaid with bookingAmount = 0: totalAmount > 0, status = SUCCESS, no Razorpay
        // 3. Prepaid or Postpaid with bookingAmount > 0: status = INITIATED, has Razorpay
        
        const isFreePlan = (plan.price?.total || 0) <= 0;
        const isPostpaidWithNoBooking = plan.isPostpaid === true && 
          (plan.bookingAmount === undefined || plan.bookingAmount === null || plan.bookingAmount === 0);
        
        if (orderStatus === 'SUCCESS' && !hasRazorpayOrder) {
          // Order is immediately successful (free plan OR postpaid with bookingAmount = 0)
          logger.info('Order completed without payment', {
            isFreePlan,
            isPostpaidWithNoBooking,
            orderStatus,
          });
          navigation.navigate('AfterPayment', {
            orderId: response.data.id,
            paymentId: undefined, // No payment needed
          });
        } else if (hasRazorpayOrder && orderStatus === 'INITIATED') {
          // Order requires payment via Razorpay (prepaid OR postpaid with bookingAmount > 0)
          logger.info('Order requires payment via Razorpay', {
            hasRazorpayOrder,
            orderStatus,
          });
          await openRazorpayCheckout(response.data);
        } else {
          // Unexpected state
          logger.error('Order in unexpected state', {
            orderStatus,
            hasRazorpayOrder,
            isFreePlan,
            isPostpaidWithNoBooking,
          });
          throw new Error('Order created but payment flow cannot be determined');
        }
      } else {
        throw new Error('Order creation failed');
      }
    } catch (err: any) {
      logger.error('Failed to create order', err);
      
      // Handle duplicate free plan enrollment error
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || err.message || '';
        
        if (errorMessage.includes('already enrolled in a free plan')) {
          // Extract plan name from error message if available
          const planMatch = errorMessage.match(/Your existing free plan enrollment: (.+)/);
          const existingPlanName = planMatch ? planMatch[1] : 'Free Plan';
          
          // Show user-friendly toast error
          toast.error(
            `You've already enrolled in a free plan: ${existingPlanName}. Each user can only enroll in one free plan. Please choose a paid plan to continue.`,
            'Free Plan Already Enrolled'
          );
          
          // Navigate to orders after a short delay
          setTimeout(() => {
            navigation.navigate('Orders');
          }, 2000);
          return;
        }
      }
      
      // Show generic error for other cases
      toast.error(err.message || 'Failed to process order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  }, [plan.id, categoryId, categoryName, areaName, areaId, serviceId, timeSlots, openRazorpayCheckout, navigation]);

  const handleContinuePayment = useCallback(async () => {
    // Log analytics event - buy_now_clicked (when address popup opens)
    await baihubAnalytics.logBuyNowClicked({
      area_id: areaId,
      area_name: areaName,
      service_id: categoryId,
      service_name: categoryName,
      came_from: categoryId ? 'area_wise_listing' : 'service_wise_listing',
      plan_id: plan.id,
      plan_amount: plan.price.amount,
      plan_discount: plan.price.discount,
      plan_total: plan.price.total,
      plan_title: plan.title,
      plan_description: plan.description,
      selected_slots_ids: timeSlots.map(s => s.id),
      selected_slots_titles: timeSlots.map(s => s.displayText),
    });
    
    if (savedAddress) {
      // Address already saved, process order directly
      processOrder(savedAddress);
    } else {
      // Show address sheet first
      setShowAddressSheet(true);
    }
  }, [savedAddress, processOrder, areaId, areaName, categoryId, categoryName, plan, timeSlots]);

  const handleAddressSuccess = useCallback(
    async (address: Address) => {
      setSavedAddress(address);
      logger.info('Address saved, processing order', { address });
      // Process order after address is saved
      processOrder(address);
    },
    [processOrder]
  );

  const handleCloseAddressSheet = useCallback(() => {
    setShowAddressSheet(false);
  }, []);

  // Calculate price breakdown
  // For full-time services (timeSlots.length === 0), use plan price directly (not multiplied)
  // For slot-based services (timeSlots.length > 0), multiply by number of slots
  const isFullTimeService = timeSlots.length === 0;
  const numberOfSlots = timeSlots.length > 0 ? timeSlots.length : 0; // 0 for full-time services
  const originalPrice = isFullTimeService 
    ? plan.price.amount 
    : plan.price.amount * numberOfSlots;
  const discount = isFullTimeService 
    ? plan.price.discount 
    : plan.price.discount * numberOfSlots;
  const total = isFullTimeService 
    ? plan.price.total 
    : plan.price.total * numberOfSlots;
  const isPostpaid = plan.isPostpaid === true;
  const bookingAmount = plan.bookingAmount 
    ? (isFullTimeService ? plan.bookingAmount : plan.bookingAmount * numberOfSlots)
    : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Checkout
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Selected */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Service
          </Text>
          <View style={styles.infoCard}>
            <Text variant="bodyLarge" style={styles.infoText}>
              {categoryName || 'Service'}
            </Text>
            <Text variant="bodyMedium" style={styles.infoSubtext}>
              {areaName}{timeSlots.length > 0 && ` • ${timeSlots.length === 1 ? timeSlots[0].displayText : `${timeSlots.length} slots`}`}
            </Text>
          </View>
        </View>

        {/* Plan Selected */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Plan
          </Text>
          <View style={styles.infoCard}>
            <Text variant="bodyLarge" style={styles.infoText}>
              {plan.title}
            </Text>
            {plan.description && (
              <Text variant="bodyMedium" style={styles.infoSubtext}>
                {plan.description}
              </Text>
            )}
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Price Breakdown
          </Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text variant="bodyLarge" style={styles.priceLabel}>
                Price
              </Text>
              <Text variant="bodyLarge" style={styles.priceValue}>
                {formatPrice(originalPrice)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text variant="bodyMedium" style={styles.priceLabel}>
                  Discount
                </Text>
                <Text variant="bodyMedium" style={styles.discountValue}>
                  -{formatPrice(discount)}
                </Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text variant="titleLarge" style={styles.totalLabel}>
                Total
              </Text>
              <Text variant="titleLarge" style={styles.totalValue}>
                {formatPrice(total)}
              </Text>
            </View>
            {/* Show booking amount for postpaid plans */}
            {isPostpaid && bookingAmount !== undefined && bookingAmount !== null && (
              <>
                <View style={styles.priceRow}>
                  <Text variant="bodyMedium" style={styles.priceLabel}>
                    Booking Amount (Pay Now)
                  </Text>
                  <Text variant="bodyLarge" style={styles.bookingAmountValue}>
                    {formatPrice(bookingAmount)}
                  </Text>
                </View>
                {total - bookingAmount > 0 && (
                  <View style={styles.priceRow}>
                    <Text variant="bodySmall" style={styles.priceLabel}>
                      Remaining Amount (Pay Later)
                    </Text>
                    <Text variant="bodySmall" style={styles.remainingAmountValue}>
                      {formatPrice(total - bookingAmount)}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Address Section */}
        {savedAddress && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Delivery Address
            </Text>
            <View style={styles.infoCard}>
              <Text variant="bodyMedium" style={styles.addressText}>
                {savedAddress.addressLine1}
                {savedAddress.addressLine2 && `, ${savedAddress.addressLine2}`}
              </Text>
              <Text variant="bodyMedium" style={styles.addressText}>
                {savedAddress.landmark}
              </Text>
              <Text variant="bodyMedium" style={styles.addressText}>
                {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Continue Payment Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Button
          mode="contained"
          onPress={handleContinuePayment}
          loading={processingOrder}
          disabled={processingOrder}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          labelStyle={styles.continueButtonLabel}
        >
          {processingOrder 
            ? 'Processing...' 
            : isPostpaid && bookingAmount !== undefined && bookingAmount !== null && bookingAmount > 0
              ? `Pay ${formatPrice(bookingAmount)} Now`
              : isPostpaid && (bookingAmount === undefined || bookingAmount === null || bookingAmount === 0)
              ? `Continue (Pay Later)`
              : total <= 0
              ? 'Continue'
              : `Pay ${formatPrice(total)} Now`}
        </Button>
      </View>

      {/* Address Bottom Sheet */}
      <AddressBottomSheet
        visible={showAddressSheet}
        onClose={handleCloseAddressSheet}
        onSuccess={handleAddressSuccess}
        areaId={areaId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for sticky button
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  infoText: {
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  infoSubtext: {
    color: '#666666',
  },
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: 0,
  },
  priceLabel: {
    color: '#666666',
  },
  priceValue: {
    color: '#000000',
    fontWeight: '500',
  },
  discountValue: {
    color: '#4caf50',
    fontWeight: '500',
  },
  totalLabel: {
    color: '#000000',
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#000000',
    fontWeight: 'bold',
  },
  bookingAmountValue: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  remainingAmountValue: {
    color: '#666666',
    fontStyle: 'italic',
  },
  addressText: {
    color: '#000000',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButton: {
    backgroundColor: '#f9cb00',
    borderRadius: 8,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
  continueButtonLabel: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


