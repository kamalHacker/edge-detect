import os
import cv2
import time
import math
import numpy as np
import pandas as pd
import skfuzzy as fuzz
import matplotlib.pyplot as plt
from skimage import metrics, morphology, measure, filters

def adaptive_gaussian_filter(img):
    img = img.astype(np.float32)
    mean_val = np.mean(img)
    diff = np.abs(img - mean_val)

    sigma_map = np.where(diff < mean_val * 0.5, 1.0, 1.6)
    sigma = np.mean(sigma_map)

    filtered = cv2.GaussianBlur(img, (5, 5), sigma)
    return filtered.astype(np.uint8)

def preprocess_image(input_data):
    img = input_data
    img = adaptive_gaussian_filter(img)
    return img


def fuzzy_edge_rules(img, membership_ratio=0.8):
    img = img.astype(np.float32)
    padded = np.pad(img, 1, mode='edge')

    C = padded[1:-1, 1:-1]
    thresh = C * membership_ratio

    I1 = (padded[:-2, :-2] > thresh).astype(np.uint8)
    I2 = (padded[:-2, 1:-1] > thresh).astype(np.uint8)
    I3 = (padded[:-2, 2:] > thresh).astype(np.uint8)
    I4 = (padded[1:-1, 2:] > thresh).astype(np.uint8)
    I5 = (padded[2:, 2:] > thresh).astype(np.uint8)
    I6 = (padded[2:, 1:-1] > thresh).astype(np.uint8)
    I7 = (padded[2:, :-2] > thresh).astype(np.uint8)
    I8 = (padded[1:-1, :-2] > thresh).astype(np.uint8)

    fuzzy_map = np.zeros_like(C, dtype=np.uint8)

    fuzzy_map |= I1 & ((I2+I3+I4+I5+I6+I7+I8) == 0)
    fuzzy_map |= I2 & ((I1+I3+I4+I5+I6+I7+I8) == 0)
    fuzzy_map |= I3 & ((I1+I2+I4+I5+I6+I7+I8) == 0)
    fuzzy_map |= I4 & ((I1+I2+I3+I5+I6+I7+I8) == 0)
    fuzzy_map |= I5 & ((I1+I2+I3+I4+I6+I7+I8) == 0)
    fuzzy_map |= I6 & ((I1+I2+I3+I4+I5+I7+I8) == 0)
    fuzzy_map |= I7 & ((I1+I2+I3+I4+I5+I6+I8) == 0)
    fuzzy_map |= I8 & ((I1+I2+I3+I4+I5+I6+I7) == 0)

    fuzzy_map |= (I3 & I4 & I5 & (I1+I2+I6+I7+I8 == 0))
    fuzzy_map |= (I5 & I6 & I7 & (I1+I2+I3+I4+I8 == 0))
    fuzzy_map |= (I1 & I8 & I7 & (I2+I3+I4+I5+I6 == 0))
    fuzzy_map |= (I1 & I2 & I3 & (I4+I5+I6+I7+I8 == 0))

    return fuzzy_map.astype(np.float32)

# Fuzzy Thresholds and Edge Detection

def fuzzy_thresholds(img):
    intensities = img.flatten()
    x = np.linspace(0, 1, 256)
    low = fuzz.trimf(x, [0, 0, 0.5])
    med = fuzz.trimf(x, [0.3, 0.5, 0.7])
    high = fuzz.trimf(x, [0.5, 1, 1])

    mean_val = np.mean(intensities)
    μ_low = fuzz.interp_membership(x, low, mean_val)
    μ_high = fuzz.interp_membership(x, high, mean_val)

    T1 = μ_low * 0.2 + μ_high * 0.4
    T2 = T1 + 0.25
    return int(T1*255), int(T2*255)

def fuzzy_canny(img, membership_ratio=0.8):
    if img.dtype != np.uint8:
        img_u8 = (np.clip(img, 0, 1) * 255).astype(np.uint8)
    else:
        img_u8 = img.copy()

    fuzzy_map = fuzzy_edge_rules(img_u8, membership_ratio=membership_ratio)
    fuzzy_map_u8 = (fuzzy_map * 255).astype(np.uint8)

    T1, T2 = fuzzy_thresholds(img_u8)

    merged = cv2.addWeighted(img_u8, 0.7, fuzzy_map_u8, 0.3, 0)

    edges = cv2.Canny(merged, T1, T2)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=1)

    return edges

# Watershed Segmentation

def watershed_segment(img, edges):
    img_u8 = img if img.dtype==np.uint8 else (img*255).astype(np.uint8)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7,7))
    edges_closed = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel, iterations=3)

    _, fg = cv2.threshold(img_u8, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    bg = cv2.dilate(edges_closed, kernel, iterations=8)

    unknown = cv2.subtract(bg, fg)

    _, markers = cv2.connectedComponents(fg)
    markers = markers + 1
    markers[unknown == 255] = 0

    color = cv2.cvtColor(img_u8, cv2.COLOR_GRAY2BGR)
    cv2.watershed(color, markers)

    seg_mask = (markers > 1).astype(np.uint8) * 255
    return markers, seg_mask