from flask import Flask, send_from_directory, render_template, abort
import json
from tinydb import TinyDB, Query

db = TinyDB('db.json', encoding="UTF-8")
DBQuery = Query()

app = Flask(__name__)




@app.route('/')
def index():
    return render_template("index.html")




page_names = {
    "perls": "Вироби з перлинами",
    "gold": "Вироби з золота",
    "silver": "Вироби з срібла",
    "platuna": "Вироби з платини",
    "discounts": "Акції",
    "about": "Про нас",
    "contacts": "Контакти"
}


pages_info = {
    "about": "<h6>Про нас</h6>Ласкаво просимо до “Перлини Вишуканості” – вашого надійного партнера у світі розкішних ювелірних прикрас. Наша компанія була заснована з метою створення унікальних та вишуканих виробів, які підкреслюють вашу індивідуальність та стиль.<h6>Наша місія</h6>Ми прагнемо дарувати нашим клієнтам радість та задоволення від володіння справжніми шедеврами ювелірного мистецтва. Кожна прикраса, створена нашими майстрами, є результатом ретельної роботи, натхнення та любові до своєї справи.<h6>Наші цінності:</h6><ul><li>Якість: Ми використовуємо лише найкращі матеріали – золото, срібло, платину та дорогоцінні камені, щоб забезпечити високу якість наших виробів.</li><li>Індивідуальність: Кожна прикраса унікальна, як і наші клієнти. Ми пропонуємо індивідуальний підхід до кожного замовлення, враховуючи всі ваші побажання та потреби.</li><li>Вишуканість: Наші дизайнери створюють прикраси, які поєднують у собі класичну елегантність та сучасні тенденції, щоб ви завжди виглядали неперевершено.</li></ul><h6>Наша команда</h6>Команда “Перлини Вишуканості” складається з талановитих дизайнерів, досвідчених ювелірів та професійних консультантів, які завжди готові допомогти вам у виборі ідеальної прикраси. Ми пишаємося нашими майстрами, які вкладають душу у кожен виріб, створюючи справжні витвори мистецтва.<h6>Наші послуги</h6>Індивідуальне замовлення: Ми пропонуємо послуги з виготовлення прикрас на замовлення, щоб ви могли втілити свої найсміливіші ідеї у життя.Ремонт та реставрація: Наші майстри з радістю допоможуть вам відновити улюблені прикраси, повернувши їм первісний вигляд та блиск.Консультації: Наші консультанти завжди готові надати професійну пораду щодо вибору прикрас, догляду за ними та зберігання.<h6>Зв’яжіться з нами</h6>Ми завжди раді новим знайомствам та співпраці. Зв’яжіться з нами, щоб дізнатися більше про наші послуги та зробити замовлення. “Перлина Вишуканості” – це ваш шлях до світу розкоші та елегантності.",
    "contacts": "<h6>Контакти</h6>Ми завжди раді спілкуванню з нашими клієнтами та готові відповісти на всі ваші запитання. Зв’яжіться з нами зручним для вас способом:<h6>Адреса</h6>вул. Прикраси, 123, м. Сміла, Черкаська область, Україна<h6>Телефон</h6>+38 (012) 345-67-89<h6>Електронна пошта</h6>info@perlyna-vyshukanosti.ua<h6>Години роботи</h6><ul class=\"no_points\"><li>Понеділок - П’ятниця: 09:00 - 18:00</li><li>Субота: 10:00 - 16:00</li><li>Неділя: 10:00 - 16:00</li></ul><h6>Соціальні мережі</h6>Слідкуйте за нами в соціальних мережах, щоб бути в курсі останніх новинок та акцій:<ul class=\"no_points\"><li>Facebook</li><li>Instagram</li><li>Twitter</li></ul>"
}

@app.route("/<page_type>/")
def get_pages(page_type):
    if page_type in ["perls", "gold", "silver", "platuna", "discounts"]:
        return render_template("articles_generator.html", page_name=page_names[page_type])
    elif page_type in ["about", "contacts"]:
        return render_template("info.html", page_name=page_names[page_type], page_info=pages_info[page_type])
    else:
        abort(404)


@app.route('/static/<path:path>/')
def get_static(path):
    return send_from_directory('static', path)


@app.errorhandler(Exception)
def error_render(e):
    return render_template("error.html", error_code=str(e.code)), e.code


@app.route("/get/<page_type>/")
def get_page_by_type(page_type: str):
    if page_type in ["perls", "gold", "silver", "platuna", "discounts", "index"]:
        match page_type:
            case "discounts":
                data = {"articles": db.search(DBQuery.price.has_discount == True)}
            case "index":
                data = {
                    "type": "perls",
                    "ids": [3, 1, 2],
                    "price": [],
                    "articles_id": [3, 4, 5, 6, 7, 8]
                }

                for i in db.get(doc_ids=data["ids"]):
                    data["price"].append(i["price"]["price"])

                data["articles"] = db.get(doc_ids=data["articles_id"])

            case _:
                data = {"articles": db.search(DBQuery.type == page_type)}
        return app.response_class(
                    response=json.dumps(data),
                    status=200,
                    mimetype='application/json'
                )
    else:
        abort(404)




@app.route("/article/<id>/")
def get_article(id):
    article = db.get(doc_id=id)
    if (article["price"]["has_discount"]):
        price = f"""<span class="discount_span">
                <span>{article["price"]["price"]}</span>
                {article["price"]["discount"]} грн
            </span>"""
    else:
        price = f"""<span class="price_span">{article["price"]["price"]} грн</span>"""

    if (article["count"] != 0):
        cart = """<div class="item_buy">
                        <span>Додати в корзину</span>
                    </div>"""
    else:
        cart = """<div class="item_solved">
                        <span>Розпродано</span>
                    </div>"""


    return render_template("article_info.html", article_id=id,
               article_type=article["type"], article_title=article["title"],
               article_price=price, article_description=article["description"],
                article_material=article["meterial"], article_to_cart=cart)



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80, debug=True)
