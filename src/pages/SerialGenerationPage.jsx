import {useState, useEffect} from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {TabView, TabPanel} from "primereact/tabview";
import {RadioButton} from "primereact/radiobutton";
import {AutoComplete} from "primereact/autocomplete";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const SerialGenerationPage = () => {
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(0);
	const [demands, setDemands] = useState([]);
	const [selectedDemand, setSelectedDemand] = useState();
	const [clientFurniture, setClientFurniture] = useState([]);
	const [selectedFurniture, setSelectedFurniture] = useState();
	const [furnitureAmount, setFurnitureAmount] = useState(0);
	const [packageQuantity, setPackageQuantity] = useState(0);
	const [mirror, setMirror] = useState(0);
	const [mirrorWood, setMirrorWood] = useState(0);
	const [lxdf, setLxdf] = useState(0);

	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState();
	const [sets, setSets] = useState([]);
	const [selectedSet, setSelectedSet] = useState();
	const [storeFurniture, setStoreFurniture] = useState([]);
	const [selectedStoreFurniture, setSelectedStoreFurniture] = useState();
	const [colors, setColors] = useState([]);
	const [selectedColor, setSelectedColor] = useState();
	const [trees, setTrees] = useState([]);
	const [selectedTree, setSelectedTree] = useState();
	const [storeAmount, setStoreAmount] = useState(0);
	const [position, setPosition] = useState(null);
	const [marketPackage, setMarketPackage] = useState(0);
	const [marketMirror, setMarketMirror] = useState(0);
	const [marketMirrorWood, setMarketMirrorWood] = useState(0);
	const [marketLxdf, setMarketLxdf] = useState(0);

	const searchDemands = async (event) => {
		if (event.query.length >= 3) {
			const response = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/api/demand`,
				{demandNumber: event.query}
			);
			setDemands(response.data.demands);
		}
	};

	const handleClientFurnitureSelect = async (selectedDemandDocNo) => {
		const selectedDemand = demands.filter(
			(item) => item.doc_no === selectedDemandDocNo
		);
		const response = await axios.post(
			`${process.env.REACT_APP_BASE_URL}/api/demand-furniture`,
			{demandId: selectedDemand[0].id}
		);
		const {furnitures} = response.data;

		const furnitureResponses = await Promise.all(
			furnitures.map((item) =>
				axios.post(`${process.env.REACT_APP_BASE_URL}/api/furniture`, {
					furnitureId: item.furniture_id,
				})
			)
		);
		const furnitureData = furnitureResponses.map((res) => res.data.furniture);

		const categoryResponses = await Promise.all(
			furnitureData.map((item) =>
				axios.post(`${process.env.REACT_APP_BASE_URL}/api/category-furniture`, {
					categoryId: item.category_id,
				})
			)
		);
		const categoryData = categoryResponses.map((res) => res.data.category);

		const setResponses = await Promise.all(
			furnitures.map((item) =>
				axios.post(`${process.env.REACT_APP_BASE_URL}/api/set-furniture`, {
					furnitureId: item.furniture_id,
				})
			)
		);
		const setData = setResponses.map((res) => res.data.set);

		const finalFurniture = furnitureData.map((furniture, index) => ({
			...furniture,
			name: `${categoryData[index].name} ${furniture.name} ${setData[index].name} `,
			amount: furnitures[index].amount,
			unique_id: furnitures[index].unique_id,
			demand_furniture_id: furnitures[index].id,
		}));

		setClientFurniture(finalFurniture);
	};

	const handleStoreSetSelect = async (category) => {
		setSelectedCategory(category);
		const getSets = await axios.post(
			`${process.env.REACT_APP_BASE_URL}/api/set`,
			{categoryId: category.id}
		);
		setSets(getSets.data.sets);
	};

	const handleStoreFurnitureSelect = async (set) => {
		setSelectedSet(set);
		const getFurnitures = await axios.post(
			`${process.env.REACT_APP_BASE_URL}/api/furnitures`,
			{setId: set.id}
		);
		setStoreFurniture(getFurnitures.data.furnitures);
	};

	const generateClientSerial = async () => {
		const sehId = sessionStorage.getItem("seh_id");
		try {
			await Promise.all([
				axios.put(`${process.env.REACT_APP_BASE_URL}/api/unique`, {
					packageQuantity: packageQuantity,
					uniqueId: selectedFurniture.unique_id,
				}),
				axios.post(`${process.env.REACT_APP_BASE_URL}/api/vipusk`, {
					furnitureId: selectedFurniture.id,
					uniqueId: selectedFurniture.unique_id,
					amount: selectedFurniture.amount,
					date: new Date().toISOString(),
					demandFurnitureId: selectedFurniture.demand_furniture_id,
					sehId: parseInt(sehId),
					glass_quantity: mirror,
					glass_wood_quantity: mirrorWood,
					lxdf_quantity: lxdf,
				}),
			]);

			navigate("/generated");
		} catch (error) {
			console.log("Error:", error);
			toast.error("Ошибка при создании серийного номера!");
		}
	};

	const generateStoreSerial = async () => {
		const sehId = sessionStorage.getItem("seh_id");
		try {
			await Promise.all([
				axios.post(
					`${process.env.REACT_APP_BASE_URL}/api/supermarket-generation`,
					{
						treeId: selectedTree.id,
						colorId: selectedColor.id,
						positionId: position,
						furnitureId: selectedStoreFurniture.id,
						amount: storeAmount,
						date: new Date().toISOString(),
						sehId: parseInt(sehId),
						packageQuantity: marketPackage,
						glass_quantity: marketMirror,
						glass_wood_quantity: marketMirrorWood,
						lxdf_quantity: marketLxdf,
					}
				),
			]);

			navigate("/generated");
		} catch (error) {
			console.log("Error:", error);
			toast.error("Ошибка при создании серийного номера!");
		}
	};

	useEffect(() => {
		const getAllCategories = async () => {
			if (activeIndex === 1) {
				try {
					const categories = await axios.get(
						`${process.env.REACT_APP_BASE_URL}/api/categories`
					);
					setAllCategories(categories.data.categories);

					const trees = await axios.get(
						`${process.env.REACT_APP_BASE_URL}/api/trees`
					);
					setTrees(trees.data.trees);

					const colors = await axios.get(
						`${process.env.REACT_APP_BASE_URL}/api/colors`
					);
					setColors(colors.data.colors);
				} catch (error) {
					console.log("Error:", error);
				}
			}
		};

		getAllCategories();
	}, [activeIndex]);

	return (
		<MainLayout header="Создание серийного номера">
			<div className="flex justify-center w-full mb-12">
				<TabView
					activeIndex={activeIndex}
					onTabChange={(e) => setActiveIndex(e.index)}
					className="border-none w-full max-w-[760px] mx-auto">
					<TabPanel
						header={
							<span
								className={`pb-2 ${
									activeIndex === 0 ? "border-b-2 border-blue-500" : ""
								}`}>
								Клиентские
							</span>
						}>
						<div className="w-full">
							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Номер заказа
								</label>
								<AutoComplete
									value={selectedDemand}
									suggestions={demands.map((item) => item.doc_no)}
									completeMethod={searchDemands}
									virtualScrollerOptions={{itemSize: 38}}
									onChange={(e) => setSelectedDemand(e.value)}
									onSelect={(e) => handleClientFurnitureSelect(e.value)}
									className="w-full py-2 pl-4 pr-8 border rounded-lg"
									inputClassName="w-full"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Мебель</label>
								<Dropdown
									value={selectedFurniture}
									onChange={(e) => setSelectedFurniture(e.value)}
									options={clientFurniture}
									disabled={!clientFurniture.length}
									optionLabel="name"
									placeholder="Выберите мебель"
									className="w-full border rounded-lg"
									loading={!clientFurniture.length && selectedDemand}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									количество мебели
								</label>
								<div className="flex items-end">
									<InputNumber
										value={
											!!furnitureAmount
												? furnitureAmount
												: selectedFurniture?.amount
										}
										onChange={(e) => setFurnitureAmount(e.value)}
										optionLabel="amount"
										className="px-4 py-3 mr-2 w-fit"
										style={{
											border: "1px solid #ced4da",
											borderRadius: "0.5rem",
										}}
									/>
									<p className="">шт</p>
								</div>
							</div>

							<div className="flex mb-8 max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-3 max-[460px]:grid-cols-1">
								<div>
									<label className="text-sm mb-1.5 font-semibold">
										Количество упаковок
									</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={packageQuantity}
											onChange={(e) => setPackageQuantity(e.value)}
											className="px-4 py-3 mr-2"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">Окно</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={mirror}
											onChange={(e) => setMirror(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">
										Стойка для окна
									</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={mirrorWood}
											onChange={(e) => setMirrorWood(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">Lxdf</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={lxdf}
											onChange={(e) => setLxdf(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
							</div>

							<button
								className="w-full px-4 py-3 text-white rounded-md bg-blue"
								onClick={generateClientSerial}
								disabled={!selectedFurniture || !packageQuantity}>
								Генерировать
							</button>
						</div>
					</TabPanel>
					<TabPanel
						header={
							<span
								className={`pb-2 ${
									activeIndex === 1 ? "border-b-2 border-blue-500" : ""
								}`}>
								Супермаркет
							</span>
						}>
						<div className="w-full">
							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Категория
								</label>
								<Dropdown
									value={selectedCategory}
									onChange={(e) => handleStoreSetSelect(e.value)}
									options={allCategories}
									optionLabel="name"
									placeholder="Выберите категорию"
									className="w-full border rounded-lg"
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Комплект</label>
								<Dropdown
									value={selectedSet}
									onChange={(e) => handleStoreFurnitureSelect(e.value)}
									options={sets}
									optionLabel="name"
									placeholder="Выберите комплект"
									className="w-full border rounded-lg"
									disabled={!sets.length}
									loading={!sets.length && selectedCategory}
									filter
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">Мебель</label>
								<Dropdown
									value={selectedStoreFurniture}
									onChange={(e) => setSelectedStoreFurniture(e.value)}
									options={storeFurniture}
									optionLabel="name"
									placeholder="Выберите мебель"
									className="w-full border rounded-lg"
									disabled={!storeFurniture.length}
									loading={!storeFurniture.length && selectedSet}
								/>
							</div>

							<div className="flex flex-col mb-8">
								<label className="text-sm mb-1.5 font-semibold">
									Количесво
								</label>
								<InputNumber
									value={storeAmount}
									onChange={(e) => setStoreAmount(e.value)}
									className="px-4 py-3 mr-2 w-fit"
									style={{border: "1px solid #ced4da", borderRadius: "0.5rem"}}
								/>
							</div>

							<div className="flex gap-4 max-sm:gap-2 max-sm:gap-y-4 max-sm:grid max-sm:grid-cols-2 max-[460px]:grid-cols-1 max-[460px]:gap-y-8">
								<div className="flex flex-col mb-8 max-sm:mb-0">
									<label className="text-sm mb-1.5 font-semibold">Цвет</label>
									<Dropdown
										value={selectedColor}
										onChange={(e) => setSelectedColor(e.value)}
										options={colors}
										placeholder="Выберите цвет"
										optionLabel="name"
										className="w-full border rounded-lg"
										disabled={!colors.length}
										loading={!colors.length}
									/>
								</div>
								<div className="flex flex-col mb-8 max-sm:mb-0">
									<label className="text-sm mb-1.5 font-semibold">Дерево</label>
									<Dropdown
										value={selectedTree}
										onChange={(e) => setSelectedTree(e.value)}
										options={trees}
										optionLabel="name"
										placeholder="Выберите дерево"
										className="w-full border rounded-lg"
										disabled={!trees.length}
										loading={!trees.length}
									/>
								</div>

								<div className="flex flex-col mb-8">
									<label className="text-sm mb-1.5 font-semibold">
										Позиция
									</label>
									<div className="flex flex-wrap gap-3 mt-[10px]">
										<div className="flex align-items-center">
											<RadioButton
												className="opacity-100 !w-5 !h-5"
												inputId="ingredient1"
												onChange={() => setPosition(1)}
												checked={position === 1}
											/>
											<label htmlFor="ingredient1" className="ml-2">
												I
											</label>
										</div>
										<div className="flex align-items-center">
											<RadioButton
												inputId="ingredient2"
												onChange={() => setPosition(2)}
												checked={position === 2}
											/>
											<label htmlFor="ingredient2" className="ml-2">
												II
											</label>
										</div>
										<div className="flex align-items-center">
											<RadioButton
												inputId="ingredient3"
												onChange={() => setPosition(3)}
												checked={position === 3}
											/>
											<label htmlFor="ingredient3" className="ml-2">
												III
											</label>
										</div>
									</div>
								</div>
							</div>
							<div className="flex mb-8 max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-3 max-[460px]:grid-cols-1">
								<div>
									<label className="text-sm mb-1.5 font-semibold">
										Количество упаковок
									</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={marketPackage}
											onChange={(e) => setMarketPackage(e.value)}
											className="px-4 py-3 mr-2"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">Окно</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={marketMirror}
											onChange={(e) => setMarketMirror(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">
										Стойка для окна
									</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={marketMirrorWood}
											onChange={(e) => setMarketMirrorWood(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
								<div>
									<label className="text-sm mb-1.5 font-semibold">Lxdf</label>
									<div className="flex items-end mt-1">
										<InputNumber
											value={marketLxdf}
											onChange={(e) => setMarketLxdf(e.value)}
											className="px-4 py-3 mr-2 w-fit"
											style={{
												border: "1px solid #ced4da",
												borderRadius: "0.5rem",
											}}
											onKeyDown={(e) => {
												if (e.key === "-" || e.key === ".") {
													e.preventDefault();
												}
											}}
										/>
									</div>
								</div>
							</div>

							<button
								className="w-full px-4 py-3 text-white rounded-md bg-blue"
								onClick={generateStoreSerial}
								disabled={
									!selectedStoreFurniture ||
									!storeAmount ||
									!selectedColor ||
									!selectedTree
								}>
								Генерировать
							</button>
						</div>
					</TabPanel>
				</TabView>
			</div>
		</MainLayout>
	);
};

export default SerialGenerationPage;
