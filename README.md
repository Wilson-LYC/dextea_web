# dextea

得闲饮茶线上点单系统-管理端

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

```
dextea_web
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  └─ img
│  ├─ components
│  │  ├─ CategoryComponents
│  │  │  ├─ AddCategoryDialog.vue
│  │  │  ├─ Categorysheet.vue
│  │  │  └─ EditCategoryDialog.vue
│  │  ├─ CommodityComponents
│  │  │  ├─ AddCommodityDialog.vue
│  │  │  ├─ CommoditySheetForCategory.vue
│  │  │  ├─ CommoditySheetForCompany.vue
│  │  │  ├─ CommoditySheetForEditStoreDialog.vue
│  │  │  ├─ CommoditySheetForStore.vue
│  │  │  ├─ CustomEditor.vue
│  │  │  └─ EditCommodityDialog.vue
│  │  ├─ CustomerComponents
│  │  │  ├─ CustomerSheet.vue
│  │  │  └─ EditCustomerDialog.vue
│  │  ├─ ImgComponents
│  │  │  ├─ AddImgDialog.vue
│  │  │  ├─ AddImgDialogForEditCommodityDialog.vue
│  │  │  ├─ EditImgDialog.vue
│  │  │  ├─ ImgSheet.vue
│  │  │  └─ SelectImgDialog.vue
│  │  ├─ OpenAreaComponents
│  │  │  ├─ AddOpenAreaDialog.vue
│  │  │  └─ OpenAreaSheet.vue
│  │  ├─ OrderComponents
│  │  │  ├─ EditOrderDialog.vue
│  │  │  ├─ OrderSheet.vue
│  │  │  └─ OrderSheetForStore.vue
│  │  ├─ StaffComponents
│  │  │  ├─ AddStaffDialog.vue
│  │  │  ├─ AddStaffDialogForStore.vue
│  │  │  ├─ EditStaffDialog.vue
│  │  │  ├─ StaffSheetForCompany.vue
│  │  │  ├─ StaffSheetForEditStoreDialog.vue
│  │  │  └─ StaffSheetForStore.vue
│  │  ├─ StoreComponents
│  │  │  ├─ AddStoreDialog.vue
│  │  │  ├─ EditStoreDialog.vue
│  │  │  ├─ StoreSetting.vue
│  │  │  └─ StoreSheet.vue
│  │  ├─ StoreServiceComponents
│  │  │  ├─ OrderDetail.vue
│  │  │  ├─ OrderNav.vue
│  │  │  └─ ServiceIndex.vue
│  │  ├─ WebFooter.vue
│  │  └─ WebHeader.vue
│  ├─ main.js
│  ├─ router
│  │  └─ index.js
│  └─ views
│     ├─ company
│     │  ├─ commodity
│     │  │  ├─ CategoryView.vue
│     │  │  └─ CommodityView.vue
│     │  ├─ CompanyFrame copy.vue
│     │  ├─ CompanyFrame.vue
│     │  ├─ customer
│     │  │  └─ CustomerView.vue
│     │  ├─ img
│     │  │  └─ ImgView.vue
│     │  ├─ order
│     │  │  └─ OrderView.vue
│     │  ├─ staff
│     │  │  └─ StaffView.vue
│     │  └─ store
│     │     ├─ OpenAreaView.vue
│     │     └─ StoreView.vue
│     ├─ frame
│     │  └─ MainFrame.vue
│     ├─ login
│     │  └─ LoginView.vue
│     ├─ result
│     │  └─ NotFound.vue
│     └─ store
│        ├─ board
│        │  └─ BoardView.vue
│        ├─ service
│        │  ├─ StoreService.css
│        │  └─ StoreService.vue
│        ├─ setting
│        │  ├─ commodity
│        │  │  └─ CommodityView.vue
│        │  ├─ order
│        │  │  └─ OrderView.vue
│        │  ├─ staff
│        │  │  └─ StaffView.vue
│        │  └─ store
│        │     └─ StoreView.vue
│        ├─ StoreSettingFrame.vue
│        └─ StoreView.vue
└─ vite.config.js

```